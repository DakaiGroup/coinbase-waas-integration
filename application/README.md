# React Native WaaS SDK example application

This is the repository for the mobile React Native SDK for Wallet-as-a-Service example app.
It exposes a subset of the WaaS APIs to the mobile developer and, in particular, is
required for the completion of MPC operations such as Seed generation and Transaction signing.

Currently, it only supports iOS.

### Prerequisites:

- [Xcode 14.0+](https://developer.apple.com/xcode/)
  - iOS15.2+ simulator (iPhone 14 recommended)
- [CocoaPods](https://guides.cocoapods.org/using/getting-started.html)
- [node 17+](https://nodejs.org/en/download/)
- [yarn 1.22+](https://yarnpkg.com/getting-started/install)

## Environment setup

Rename `.env.template` to `.env` and provide the required values.

- `API_BASE` is your endpoints base URL.
- `RPC_URL` is your JSON RPC provider URL.
- `EXPLORER_URL` is your blockchain explorer base URL.
- `CHAIN_ID` is your node property.

## Installation

This repository provides an example app that demonstrates how the APIs should be used. To run it,
ensure you have Xcode open and run the following from the root directory of the repository:

```bash
yarn # Install packages for the root directory
cd ios
bundle install # Install all of the required gems
bundle exec pod install # Install the native deps
yarn ios # Launching the applicaiton
```
