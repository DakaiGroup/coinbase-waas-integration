# Coinbase WaaS Integration

Made by [<img src="https://github.com/DakaiGroup/coinbase-waas-integration/raw/main/dakai-logo.png" height="18" />](https://www.dakai.io/).

## The demo application has two parts:

- in the [application](/application/) folder is the react native app, which is a basic wallet
- in the [waas-inter-server](/waas-inter-server/) folder is a backend that is using the WaaS go client library

## Known issues and tips:

- The [`registerDevice()`](https://github.com/DakaiGroup/coinbase-waas-integration/blob/fe3d856a637fea716d979b9d866a75f6067dfab9/application/src/contexts/user/index.tsx#L123) method fails if a user wants to register from the same device. This is a known issue in the SDK and probably it will be sorted. As a workaround, you can save the `device.Name` and use it as a constant or erase the device with every registration.
- For the broadcasting, the waas-inter-server uses a different package instead of the WaaS broadcast implementation. 
- The application is using ether.js for constructing the tx-data and getting info from on-chain.
- The application and the server is on goerli testnet.
- To test the app with custom ERC-20 tokens, update the following [list](https://github.com/DakaiGroup/coinbase-waas-integration/blob/fe3d856a637fea716d979b9d866a75f6067dfab9/application/src/constants/index.ts#L73) with the token addresses.
- The `API_PRIVATE_KEY` needs to be between double quotes