


# WaaS inter server

## Setup

1. Rename [`env.example`](env.example) to `.env` and provide the required values.

- `API_KEY_NAME` and `API_PRIVATE_KEY` is your api credentials for Coinbase WaaS.

- `MONGOURI` is your mongodb url.

- `POOL_NAME` the pool you created for your application.

- `TOKEN_HOUR_LIFESPAN` the jwt token lifespan.

- `RPC_URL` is your rpc node url. (For better performance it is advised to use your custom node, but the public ones are fine too.)

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
    "displayName" : "My Awesome Pool"
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
    "deviceId": "devices/5821af2a-579c-4052-9a0f-a114ab2564a6"
}
```
To get the device id the `registerDevice()` function needs to be called first from the SDK.

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
Gets the currently signed in user from the jwt token. *(Note: the wallet and addresses won't be part of the response until it's created)*

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

### Generate wallet and address
This endpoint should be called when the user don't have a wallet at all along with the SDK where the polling and proccessing happens. The response contains is the operation number, which can be used to poll and wait for the pending address.

Response
```json
{
    "opName": "operations/56c618ba-33a8-4293-ae58-d5fcf8d2dcaf",
    "done": false
}
```

### Generate address
Once the user has a wallet, the generate address endpoint should be used to create new addresses. The response contains the operation number which can be used to poll for the pending address.

Response
```json
{
    "opName": "operations/776182e0-f774-46e7-82a5-754214949c96",
    "done": false
}
```

### Broadcast transaction
Broadcast the raw transaction sent by the client. If successful returns the txHash.

Request
```json
{
    "rawTransaction" : "02f8b005808459682f0085031afe070082f6189490e74012256d74a12bf64bdcc307522df664440a80b844a9059cbb0000000000000000000000004bfbff52d118696a1d8ab8f6175d8dfbca27c5930000000000000000000000000000000000000000000000008ac7230489e80000c080a09cc6f6c3a4642328a228f73b962ff9c33ecd3d7f34e2dfd30ec9b8797af93338a041a37e5fd14dfcaef190323759308f2e22323fde575a454ebcbf6a73abac092a"
}
```

Response
```json
{
    "txHash" : "0x2421ce8dbbd319674d187a2af3c008db863f6cdb8740c750e94d2c24ff7ad03c"
}
```

All these requests and responses can be found in the provided [Postman collection](/waas-inter-server.postman_collection.json).
