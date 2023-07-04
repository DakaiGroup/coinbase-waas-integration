package services

import (
	"context"
	"encoding/hex"
	"fmt"
	"log"

	//"math"
	//"math/big"
	"net/http"
	"time"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/db"
	"waas-example/inter-server/internal/requests"
	"waas-example/inter-server/internal/responses"

	"github.com/coinbase/waas-client-library-go/auth"
	"github.com/coinbase/waas-client-library-go/clients"
	v1clients "github.com/coinbase/waas-client-library-go/clients/v1"
	keys "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_keys/v1"

	//mpcTransactions "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_transactions/v1"
	wallets "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_wallets/v1"
	pools "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/pools/v1"
	inputs "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/protocols/ethereum/v1"
	protocols "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/protocols/v1"
	v1types "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/types/v1"
)

var authOpt = clients.WithAPIKey(&auth.APIKey{
	Name:       configs.EnvApiKeyName(),
	PrivateKey: configs.EnvApiPrivateKey(),
})

func CreatePool(ctx context.Context, poolName string) (*pools.Pool, error) {

	client, err := v1clients.NewPoolServiceClient(ctx, authOpt)

	if err != nil {
		log.Printf("error instantiating PoolService client: %v", err)
	}

	log.Println("Instantiated PoolServiceClient")
	log.Println("Creating Pool....")

	pool, err := client.CreatePool(ctx, &pools.CreatePoolRequest{
		Pool: &pools.Pool{
			DisplayName: poolName,
		},
	})
	if err != nil {
		log.Printf("error creating pool: %v", err)
		return nil, err
	}

	_, err = db.CreateNewPool(ctx, pool.GetName(), pool.GetDisplayName())

	if err != nil {
		return nil, err
	}

	return pool, nil
}

func RegisterDevice(ctx context.Context, registrationData string) (string, error) {
	client, err := v1clients.NewMPCKeyServiceClient(ctx, authOpt)
	if err != nil {
		log.Fatalf("error instantiating mpc key service client: %v", err)
	}

	device, err := client.RegisterDevice(ctx, &keys.RegisterDeviceRequest{
		RegistrationData: []byte(registrationData),
	})

	if err != nil {
		log.Printf("error registering device: %v", err)
		return "", err
	}
	return device.GetName(), nil
}

func CreateWallet(ctx context.Context, userId string) (*keys.MPCOperation, error) {

	client, err := v1clients.NewMPCWalletServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating WalletService client: %v", err)
	}

	log.Println("Instantiated WalletService.")
	log.Println("Creating Wallet....")

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	walletOp, err := client.CreateMPCWallet(ctx, &wallets.CreateMPCWalletRequest{
		Parent:    user.Pool.Name,
		Device:    user.DeviceId,
		MpcWallet: &wallets.MPCWallet{},
	})
	if err != nil {
		return nil, err
	}

	_, err = db.UpdateUserWalletOpById(ctx, userId, walletOp.Name())
	if err != nil {
		log.Printf("error saving walletOp name: %v", err)
		return nil, err
	}

	metadata, _ := walletOp.Metadata()
	log.Printf("Succesfully CreateMPCWallet operation and the following deviceGroup: %v", metadata.GetDeviceGroup())

	// save device group
	_, err = db.UpdateDeviceGroupById(ctx, userId, metadata.GetDeviceGroup())

	if err != nil {
		return nil, err
	}

	resultCh, errorCh := pollMPCOperations(ctx, 200, metadata.GetDeviceGroup())
	select {
	case mpcOp := <-resultCh:
		return mpcOp, nil
	case err := <-errorCh:
		return nil, err
	}
}

func GenerateAddress(ctx context.Context, userId string) (*wallets.Address, error) {

	client, err := v1clients.NewMPCWalletServiceClient(ctx, authOpt)
	if err != nil {
		log.Fatalf("error instantiating WalletService client: %v", err)
	}

	log.Println("Instantiated WalletService.")
	log.Println("Generating address....")

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	address, err := client.GenerateAddress(ctx, &wallets.GenerateAddressRequest{
		MpcWallet: user.Wallet,
		Network:   configs.Network(),
	})

	if err != nil {
		log.Printf("error generateAddressRequest: %v", err)
		return nil, err
	}

	_, err = db.InsertNewUserAddressAndKeyById(ctx, userId, address.GetName(), address.MpcKeys[0])
	if err != nil {
		log.Printf("error saving new address: %v", err)
		return nil, err
	}

	log.Printf("generated address: %v", address.GetName())
	log.Printf("Succesfully updated addresses for user with id: %v", userId)

	return address, nil
}

func PollMpcOperation(ctx context.Context, userId string) (*keys.MPCOperation, error) {
	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	resultCh, errorCh := pollMPCOperations(ctx, 200, user.DeviceGroup)
	select {
	case mpcOp := <-resultCh:
		return mpcOp, nil
	case err := <-errorCh:
		return nil, err
	}
}

func CreateTransaction(ctx context.Context, userId string, transaction requests.TransactionWithSigOpNameAndKey) (*responses.CreateTxSignatureResponse, error) {
	client, err := v1clients.NewProtocolServiceClient(ctx, authOpt)
	if err != nil {
		log.Fatalf("error instantiating protocol service client: %v", err)
	}

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	data, err := hex.DecodeString(transaction.Data)
	if err != nil {
		return nil, err
	}

	req := &protocols.ConstructTransactionRequest{
		Network: configs.Network(),
		Input: &v1types.TransactionInput{
			Input: &v1types.TransactionInput_Ethereum_1559Input{
				Ethereum_1559Input: &inputs.EIP1559TransactionInput{
					ChainId:              transaction.ChainID,
					Nonce:                transaction.Nonce,
					MaxPriorityFeePerGas: transaction.MaxPriorityFeePerGas,
					MaxFeePerGas:         transaction.MaxFeePerGas,
					Gas:                  transaction.Gas,
					FromAddress:          transaction.From,
					ToAddress:            transaction.To,
					Value:                transaction.Value,
					Data:                 data,
				},
			},
		},
	}

	tx, err := client.ConstructTransaction(ctx, req)

	if err != nil {
		log.Fatalf("error creating tx: %v", err)
	}

	sigReq := &keys.CreateSignatureRequest{
		Parent: transaction.Key,
		Signature: &keys.Signature{
			Payload: tx.GetRequiredSignatures()[0].GetPayload(),
		},
	}

	keyClient, err := v1clients.NewMPCKeyServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating KeyService client: %v", err)
	}

	sigOp, err := keyClient.CreateSignature(ctx, sigReq)

	if err != nil {
		return nil, err
	}

	resultCh, errorCh := pollMPCOperations(ctx, 200, user.DeviceGroup)
	select {
	case mpcOp := <-resultCh:
		return &responses.CreateTxSignatureResponse{MpcData: mpcOp.GetMpcData(), SignatureOpName: sigOp.Name()}, nil
	case err := <-errorCh:
		return nil, err
	}
}

func WaitSignatureAndBroadcast(ctx context.Context, sigOpAndTx requests.TransactionWithSigOpNameAndKey) (string, error) {
	client, err := v1clients.NewMPCKeyServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating KeyService client: %v", err)
	}

	// we saved the wallet operation in the create wallet call so we can use it here
	resp := client.CreateSignatureOperation(sigOpAndTx.SigOpName)

	signature, err := resp.Wait(ctx)

	if err != nil {
		log.Printf("Cannot wait signature response: %v", err)
		return "", err
	}

	log.Println("Signature OP completed...")

	data, err := hex.DecodeString(sigOpAndTx.Data)
	if err != nil {
		return "", err
	}

	broadcastReq := &protocols.BroadcastTransactionRequest{
		Network: configs.Network(),
		Transaction: &v1types.Transaction{
			Input: &v1types.TransactionInput{
				Input: &v1types.TransactionInput_Ethereum_1559Input{
					Ethereum_1559Input: &inputs.EIP1559TransactionInput{
						ChainId:              sigOpAndTx.ChainID,
						Nonce:                sigOpAndTx.Nonce,
						MaxPriorityFeePerGas: sigOpAndTx.MaxPriorityFeePerGas,
						MaxFeePerGas:         sigOpAndTx.MaxFeePerGas,
						Gas:                  sigOpAndTx.Gas,
						FromAddress:          sigOpAndTx.From,
						ToAddress:            sigOpAndTx.To,
						Value:                sigOpAndTx.Value,
						Data:                 data,
					},
				},
			},
			RequiredSignatures: []*v1types.RequiredSignature{
				{
					Signature: signature.Signature,
				},
			},
		},
	}

	protoClient, err := v1clients.NewProtocolServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating Protocol client: %v", err)
	}

	broadcastTx, err := protoClient.BroadcastTransaction(ctx, broadcastReq)

	if err != nil {
		return "", err
	}

	log.Printf("Transaction broadcasted: %v", broadcastTx.Hash)

	return broadcastTx.Hash, nil
}

func WaitWallet(ctx context.Context, userId string) (bool, error) {
	client, err := v1clients.NewMPCWalletServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating WalletService client: %v", err)
	}

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return false, err
	}

	// we saved the wallet operation in the create wallet call so we can use it here
	resp := client.CreateMPCWalletOperation(user.WalletOp)

	newWallet, err := resp.Wait(ctx)

	if err != nil {
		log.Printf("Cannot wait create mpc wallet response: %v", err)
		return false, err
	}

	_, err = db.UpdateUserWalletById(ctx, userId, newWallet.Name)

	if err != nil {
		return false, err
	}

	return true, nil
}

func pollMPCOperations(ctx context.Context, pollInterval int64, deviceGroup string) (chan *keys.MPCOperation, chan error) {

	client, err := v1clients.NewMPCKeyServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating KeyService client: %v", err)
	}

	log.Println("Instantiated KeyServiceClient.")
	log.Println("Polling for MPC Operations....")

	if pollInterval == 0 {
		pollInterval = 200
	}

	timeout := time.After(time.Minute)
	ticker := time.NewTicker(time.Duration(pollInterval) * time.Millisecond)

	resultCh := make(chan *keys.MPCOperation)
	errorCh := make(chan error)

	go func(deviceGroup string) {
		for {
			select {
			case <-timeout:
				retErr := fmt.Errorf("timed out polling for device group %s", deviceGroup)
				log.Println("[DEBUG]: timeout on polling for MPC Operations")
				errorCh <- retErr
			case <-ticker.C:
				log.Println("[DEBUG]: Poolling MPC Operations")
				req := &keys.ListMPCOperationsRequest{
					Parent: deviceGroup,
				}
				listMpcOperationsResp, err := client.ListMPCOperations(context.Background(), req)
				if err != nil {
					if clients.HTTPCode(err) == http.StatusNotFound {
						// Continue polling if no MPC operation was found.
						continue
					}
					errorCh <- err
				}

				if len(listMpcOperationsResp.GetMpcOperations()) == 0 {
					// Continue polling if there were no MPC operations.
					continue
				}

				mpcOps := listMpcOperationsResp.GetMpcOperations()

				if len(mpcOps) > 0 {
					resultCh <- mpcOps[0]
					ticker.Stop()
					return
				}
			}
		}
	}(deviceGroup)

	return resultCh, errorCh
}
