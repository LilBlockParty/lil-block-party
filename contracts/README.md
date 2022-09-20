# Preview Lil Nouns Contracts
## Requirements
* [Foundry](https://github.com/foundry-rs/foundry) for contract development
* [Node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for hardhat tools and some Solidity dependencies 

## Install
* Install the npm dependencies `npm install`
* Configure the environment variables: Create a file .env using .env.example as a template
* Build the contracts: `npm run build`
* Start a local blockchain node: `npm run rpc`
* Deploy contracts to local node:  `npm run deploy`

## Running 
See package.json for how to build, deploy, etc.

## Solidity and Javascript dependencies
This project uses gitmodules (via Forge) to manage Solidity dependencies (stored in lib/), and npm for developer tooling (e.g. hardhat, prettier), and Solidity dependencies if unavailable via gitmodules.
