package services

import (
	"context"
	"log"
	"net/url"
	"time"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/db"
	"waas-example/inter-server/internal/responses"

	"github.com/INFURA/go-ethlibs/node"
	"github.com/WaaS-Private-Preview-v1/waas-client-library/go/coinbase/cloud/clients"
	"github.com/WaaS-Private-Preview-v1/waas-client-library/go/coinbase/cloud/clients/wallets/v1alpha1"
	keys "github.com/WaaS-Private-Preview-v1/waas-client-library/go/coinbase/cloud/keys/v1alpha1"
	pools "github.com/WaaS-Private-Preview-v1/waas-client-library/go/coinbase/cloud/pools/v1alpha1"
	wallets "github.com/WaaS-Private-Preview-v1/waas-client-library/go/coinbase/cloud/wallets/v1alpha1"
)

// defaultHost is the default host to use for WaaS API clients.
const host = "https://cloud-api-beta.coinbase.com"

var apiKeyName = configs.EnvApiKeyName()
var apiPrivateKey = configs.EnvApiPrivateKey()

func CreatePool(ctx context.Context, poolName string) (*pools.Pool, error) {
	endpoint, err := url.Parse(host)

	endpoint.Path = "waas/pools"

	client, err := clients.NewV1Alpha1PoolServiceClient(
		ctx,
		endpoint.String(),
		clients.WithCloudAPIKeyAuth(clients.WithAPIKey(apiKeyName, apiPrivateKey)))
	if err != nil {
		log.Fatalf("error instantiating PoolService client: %v", err)
	}

	log.Println("Instantiated PoolServiceClient")
	log.Println("Creating Pool....")

	req := &pools.CreatePoolRequest{
		Pool: &pools.Pool{
			DisplayName: poolName,
		},
	}

	pool, err := client.CreatePool(ctx, req)
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

func CreateDeviceGroup(ctx context.Context, deviceId string, pool string) (*keys.DeviceGroup, error) {
	endpoint, err := url.Parse(host)
	endpoint.Path = "waas/keys"

	client, err := clients.NewV1Alpha1KeyServiceClient(
		ctx,
		endpoint.String(),
		clients.WithCloudAPIKeyAuth(clients.WithAPIKey(apiKeyName, apiPrivateKey)))
	if err != nil {
		log.Fatalf("error instantiating KeyService client: %v", err)
	}

	log.Println("Instantiated KeyServiceClient.")
	log.Println("Creating Device group....")

	deviceGroupReq, err := client.CreateDeviceGroup(ctx, &keys.CreateDeviceGroupRequest{
		Parent: pool,
		DeviceGroup: &keys.DeviceGroup{
			Devices: []string{deviceId},
		},
	})
	if err != nil {
		log.Printf("error creating device group request: %v", err)
		return nil, err
	}
	return deviceGroupReq.Wait(ctx)
}

func CreateWallet(ctx context.Context, userId string) (*wallets.Wallet, error) {
	endpoint, err := url.Parse(host)

	endpoint.Path = "waas/wallets"

	client, err := clients.NewV1Alpha1WalletServiceClient(
		ctx,
		endpoint.String(),
		clients.WithCloudAPIKeyAuth(clients.WithAPIKey(apiKeyName, apiPrivateKey)))
	if err != nil {
		log.Fatalf("error instantiating WalletService client: %v", err)
	}

	log.Println("Instantiated WalletService.")
	log.Println("Creating Wallet....")

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	wallet, err := client.CreateWallet(ctx, &wallets.CreateWalletRequest{
		Parent: user.Pool.Name,
		Wallet: &wallets.Wallet{
			DeviceGroup:    user.DeviceGroup,
			GenerationType: wallets.Wallet_HD,
		},
	})
	if err != nil {
		return nil, err
	}
	log.Printf("Succesfully created wallet in waas: %v", wallet.Name)

	_, err = db.UpdateUserWalletById(ctx, userId, wallet.Name)

	if err != nil {
		return nil, err
	}
	log.Printf("Succesfully updated wallet for user: %v", user.Username)

	return wallet, nil
}

func GenerateAddress(ctx context.Context, userId string) (*responses.AddressGenerationResponse, error) {
	endpoint, err := url.Parse(host)

	endpoint.Path = "waas/wallets"

	client, err := clients.NewV1Alpha1WalletServiceClient(
		ctx,
		endpoint.String(),
		clients.WithCloudAPIKeyAuth(clients.WithAPIKey(apiKeyName, apiPrivateKey)))
	if err != nil {
		log.Fatalf("error instantiating WalletService client: %v", err)
	}

	log.Println("Instantiated WalletService.")
	log.Println("Generating address....")

	user, err := db.GetUserById(ctx, userId)

	if err != nil {
		return nil, err
	}

	addressOp, err := client.GenerateAddress(ctx, &wallets.GenerateAddressRequest{
		Wallet:      user.Wallet,
		Network:     "networks/ethereum-goerli",
		AddressSpec: "addressSpecs/ethereum-standard-address",
	})

	if err != nil {
		log.Printf("error generateAddressRequest: %v", err)
		return nil, err
	}

	log.Println("Sending addressOp completion to a goroutine...")

	ctxWT, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	go func() {
		waitForAddressOp(ctxWT, addressOp, userId)
		defer cancel()
	}()

	log.Printf("Successfully created generateAddressRequest: %v", addressOp.Name())

	return &responses.AddressGenerationResponse{OpName: addressOp.Name(), Done: addressOp.Done()}, nil
}

// not using waas lib but logically it fits here
func BroadcastTransaction(ctx context.Context, rawTx string) (string, error) {
	client, err := node.NewClient(ctx, configs.RpcUrl())
	if err != nil {
		log.Println(err)
	}

	return client.SendRawTransaction(ctx, "0x"+rawTx)
}

// goroutine to wait for the address and save it
func waitForAddressOp(ctx context.Context, addressOp v1alpha1.ClientGenerateAddressOperation, userId string) (*wallets.Address, error) {
	log.Println("Waiting for addressOp to complete...")
	address, err := addressOp.Wait(ctx)
	if err != nil {
		log.Printf("error with wait signing: %v", err)
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
