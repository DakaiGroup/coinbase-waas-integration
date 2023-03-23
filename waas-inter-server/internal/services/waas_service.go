package services

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/db"

	//"waas-example/inter-server/internal/responses"

	"github.com/google/uuid"

	"github.com/INFURA/go-ethlibs/node"
	"github.com/coinbase/waas-client-library-go/auth"
	"github.com/coinbase/waas-client-library-go/clients"
	v1clients "github.com/coinbase/waas-client-library-go/clients/v1"
	keys "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_keys/v1"
	wallets "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/mpc_wallets/v1"
	pools "github.com/coinbase/waas-client-library-go/gen/go/coinbase/cloud/pools/v1"
)

var authOpt = clients.WithAPIKey(&auth.APIKey{
	Name:       configs.EnvApiKeyName(),
	PrivateKey: configs.EnvApiPrivateKey(),
})

func CreatePool(ctx context.Context, poolName string) (*pools.Pool, error) {

	client, err := v1clients.NewPoolServiceClient(ctx, authOpt)

	if err != nil {
		log.Fatalf("error instantiating PoolService client: %v", err)
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

	op, err := client.CreateMPCWallet(ctx, &wallets.CreateMPCWalletRequest{
		Parent:    user.Pool.Name,
		Device:    user.DeviceId,
		MpcWallet: &wallets.MPCWallet{},
	})
	if err != nil {
		return nil, err
	}

	metadata, _ := op.Metadata()
	log.Printf("Succesfully CreateMPCWallet operation and the following deviceGroup: %v", metadata.GetDeviceGroup())

	// save device group
	_, err = db.UpdateDeviceGroupById(ctx, userId, metadata.GetDeviceGroup())

	if err != nil {
		return nil, err
	}
	pollCh := make(chan bool)
	mpcOp, err := pollMPCOperations(ctx, pollCh, 200, metadata.GetDeviceGroup())
	pollCh <- true
	if err != nil {
		return nil, err
	}

	log.Printf("Succesfully got MPC Operation: %v", mpcOp.GetName())

	return mpcOp, nil
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
		RequestId: uuid.New().String(),
	})

	if err != nil {
		log.Printf("error generateAddressRequest: %v", err)
		return nil, err
	}

	_, err = db.InsertNewUserAddressById(ctx, userId, address.GetName())
	if err != nil {
		log.Printf("error saving new address: %v", err)
		return nil, err
	}

	log.Printf("generated address: %v", address.GetName())
	log.Printf("Succesfully updated addresses for user with id: %v", userId)

	return address, nil
}

// not using waas lib but logically it fits here
func BroadcastTransaction(ctx context.Context, rawTx string) (string, error) {
	client, err := node.NewClient(ctx, configs.RpcUrl())
	if err != nil {
		log.Println(err)
	}

	return client.SendRawTransaction(ctx, "0x"+rawTx)
}

func pollMPCOperations(ctx context.Context, pollChan chan bool, pollInterval int64, deviceGroup string) (*keys.MPCOperation, error) {

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

	var response []*keys.MPCOperation
	var retErr error

	POLL_LOOP:
		for {
			select {
			case <-pollChan:
				log.Println("[DEBUG]: Broke out POLL_LOOP")
				break POLL_LOOP
			case <-timeout:
				retErr = fmt.Errorf("timed out polling for device group %s", deviceGroup)
				log.Println("[DEBUG]: timeout on polling for MPC Operations")
				break POLL_LOOP
			case <-ticker.C:
				log.Println("[DEBUG]: Poolling MPC Operations")
				req := &keys.ListMPCOperationsRequest{
					Parent: deviceGroup,
				}
				listMpcOperationsResp, err := client.ListMPCOperations(context.Background(), req)
				if err != nil {
					if clients.HTTPCode(err) == http.StatusNotFound {
						// Continue polling if no MPC operation was found.
						continue POLL_LOOP
					}

					retErr = err

					break POLL_LOOP
				}

				if len(listMpcOperationsResp.GetMpcOperations()) == 0 {
					// Continue polling if there were no MPC operations.
					continue POLL_LOOP
				}

				response = listMpcOperationsResp.GetMpcOperations()

				if len(response) > 0 {
					return response[0], nil
				}
			}
		}

		return nil, retErr
}
