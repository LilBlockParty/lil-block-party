require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan");

const DEFAULT_MAINNET_PRIVATE_KEY = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"

// Helpers
const getEnvVariable = (key, defaultValue) => {
  if (process.env[key]) {
    return process.env[key]
  }
  if (!defaultValue) {
    console.log(`${key} is not defined and no default value was provided.`)
    return ""
  }
  return defaultValue
}

// Constants / environment variables
const ETHERSCAN_API_KEY = getEnvVariable("ETHERSCAN_API_KEY")
const GOERLI_RPC_URL = getEnvVariable("GOERLI_RPC_URL")
const RINKEBY_RPC_URL = getEnvVariable("RINKEBY_RPC_URL")
const MAINNET_RPC_URL = getEnvVariable("MAINNET_RPC_URL")
const MAINNET_PRIVATE_KEY = getEnvVariable("MAINNET_PRIVATE_KEY", DEFAULT_MAINNET_PRIVATE_KEY)

// Config
const hardhatConfig = {
  defaultNetwork: "hardhat",
  solidity: "0.8.9",
  networks: {
    hardhat: {
      mining: {
        auto: false
        // auto: true,
        // interval: 8000
      },
      forking: {
        url: MAINNET_RPC_URL,
        blockNumber: 15233856 // 1 block before Lil Noun 3935 was minted
        // blockNumber: 15505026  // 1 block before Lil Noun 5717 was minted (this was a misfire)
      },
      loggingEnabled: true,
    },
    // The localhost network points to the hardhat network. The localhost
    // network is used instead of hardhat for scripts (e.g. deploy.js)
    // because there are bugs running scripts on the hardhat network
    // when forking is enabled. For me, this manifested as the scripts
    // not deploying to the hardhat node already running via `npx hardhat node`.
    // Specifying a separate network `localhost` with the same address
    // (but without forking) solved this issue - deploys were made to the
    // hardhat network node.
    //
    // Also see https://ethereum.stackexchange.com/questions/110931/hardhat-mainnet-forking-and-impersonating-an-account-isnt-working-help#comment133879_110931
    localhost: { 
      url: 'http://localhost:8545',
      mining: {
        auto: false
      }
    },
    goerli: {
      chainId: 5,
      url: GOERLI_RPC_URL,
      accounts: [MAINNET_PRIVATE_KEY]
    },
    rinkeby: {
      chainId: 4,
      url: RINKEBY_RPC_URL,
      accounts: [MAINNET_PRIVATE_KEY],
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      chainId: 1,
      accounts: [MAINNET_PRIVATE_KEY]
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
}

module.exports = hardhatConfig
