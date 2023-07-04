# WaaS inter server

## Prerequisites

- [Golang 1.17+](https://go.dev/learn/)

## Setup

1. Rename [`env.example`](env.example) to `.env` and provide the required values.

- `API_KEY_NAME` and `API_PRIVATE_KEY` is your api credentials for Coinbase WaaS.

- `MONGOURI` is your mongodb url.

- `POOL_NAME` the pool you created for your application.

- `TOKEN_HOUR_LIFESPAN` the jwt token lifespan.

- `RPC_URL` is your rpc node url. (For better performance it is advised to use your custom node, but the public ones are fine too.)

- `NETWORK` the blockchain network the app is on (needs to be provided in WaaS supported format).

### Tip

To start a mongo db locally with docker use:

```console
docker run -d  --name mongo-on-docker  -p 27888:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
```

So the `MONGOURI` can be:

```console
MONGOURI="mongodb://mongoadmin:secret@localhost:27888/?authSource=admin"
```

2. Build the project

```console
go build ./cmd/inter-server/
```

3. Run the server

```console
./inter-server
```

# Api

## Public endpoints

### Create Pool

A pool **must be created** before users starts to register. This api endpoint is public for now for easier useablity. Change this according to your requirements.

Request

```json
{
  "displayName": "My Awesome Pool"
}
```

Response

```json
{
  "name": "pools/596a9e36-51a5-4e94-831c-0b11cfc8e1a7",
  "display_name": "My Awesome Pool"
}
```

### Register User

Request must have the following fields

```json
{
  "username": "username",
  "password": "mypassword",
  "registrationData": "eyJwYXJ0aWNpcGFudElkIjoiMjQ2MGIwNjMtZGQyNC00NmZiLTk0OWUtNDYzM2VhZGUzZDAwIiwicGFydGl0aW9uIjoiMiJ9"
}
```

To get the registration data the `bootstrapDevice(passcode)` and `getRegistrationData()` function needs to be called first from the SDK.

### Login

Request

```json
{
  "username": "username",
  "password": "mypassword"
}
```

Response

```json
{
  "token": "<the jwt token>"
}
```

## Protected endpoints

### Current User

Gets the currently signed in user from the jwt token. _(Note: the wallet and addresses won't be part of the response until it's created)_

Response

```json
{
  "message": "success",
  "data": {
    "user": {
      "id": "63f4ad6c9b888096f925e39b",
      "username": "gabkov",
      "pool": {
        "id": "63ea2dba4b75a1f0251b7332",
        "name": "pools/596a9e36-51a5-4e94-831c-0b11cfc8e1a7",
        "displayName": "My Awesome Pool"
      },
      "deviceId": "devices/5821af2a-579c-4052-9a0f-a114ab2564a6",
      "deviceGroup": "pools/596a9e36-51a5-4e94-831c-0b11cfc8e1a7/deviceGroups/60735a20-7ea5-4a8d-a6d6-4245cd993d7e",
      "wallet": "pools/596a9e36-51a5-4e94-831c-0b11cfc8e1a7/wallets/f01fd9bb-e397-41d4-ab73-faeb54c8aad2",
      "addresses": [
        {
          "address": "networks/ethereum-goerli/addresses/0xb32Fb49e8591AE7565428cDe33Fc8d86766Ab85C"
        },
        {
          "address": "networks/ethereum-goerli/addresses/0xb02fde8101dC56E65d59D65A074a3533931edFE3"
        }
      ]
    }
  }
}
```

### Create wallet

This endpoint should be called when the user don't have a wallet at all along with the SDK. The response contains the operation number, which can be used to poll and wait for the pending MPC Wallet.

Response

```json
{
  "walletOpName": "operations/56c618ba-33a8-4293-ae58-d5fcf8d2dcaf",
  "mpcData": [],
  "deviceGroup": "pools/596a9e36-51a5-4e94-831c-0b11cfc8e1a7/deviceGroups/60735a20-7ea5-4a8d-a6d6-4245cd993d7e"
}
```

### Wait wallet

Waits for the newly created user wallet.

Response

```json
{
  "success": true
}
```

### Generate address

Once the user has a wallet, the generate address endpoint should be used to create new addresses.

Response

```json
{
    "name": "networks/ethereum-goerli/addresses/0xb32Fb49e8591AE7565428cDe33Fc8d86766Ab85C",
    ...
}
```

### Create transaction

Creates a new transaction which can be broadcasted.

Request

```json
{
  "key": "pools/268f32de-2d14-41e2-a8da-0ba3468c3a64/deviceGroups/ad3815d7-e62c-4004-8495-52fa84d90798/mpcKeys/70656a70-4b6a-792b-4a54-5667472b4b67",
  "chainID": "0x5",
  "nonce": 2,
  "maxPriorityFeePerGas": "0x59682f00",
  "maxFeePerGas": "0x59682f24",
  "gas": 35099,
  "from": "0xcE929bF2e0917FE1c5c9AaEEcD7902280889aB48",
  "to": "0x90e74012256D74A12Bf64bdcc307522DF664440a",
  "value": "0x0",
  "data": "a9059cbb0000000000000000000000003cd63a9adabd4abf861ce407172cb41bd684a91e0000000000000000000000000000000000000000000000000de0b6b3a7640000"
}
```

Response

```json
{
  "mpc_data": "",
  "signatureOp": ""
}
```

### Wait signature and broadcast

Waits for the newly created transaction signature and then broadcasts it with WaaS.

Request

```json
{
  "sigOpName": "operations/80f80c52-7afd-4dd1-b56b-70d5655a6a8c",
  "chainID": "0x5",
  "nonce": 2,
  "maxPriorityFeePerGas": "0x59682f00",
  "maxFeePerGas": "0x59682f24",
  "gas": 35099,
  "from": "0xcE929bF2e0917FE1c5c9AaEEcD7902280889aB48",
  "to": "0x90e74012256D74A12Bf64bdcc307522DF664440a",
  "value": "0x0",
  "data": "a9059cbb0000000000000000000000003cd63a9adabd4abf861ce407172cb41bd684a91e0000000000000000000000000000000000000000000000000de0b6b3a7640000"
}
```

Response

```json
{
  "txHash": "0x2421ce8dbbd319674d187a2af3c008db863f6cdb8740c750e94d2c24ff7ad03c"
}
```

All these requests and responses can be found in the provided [Postman collection](/waas-inter-server.postman_collection.json).
