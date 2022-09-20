const { ethers, network } = require("hardhat");
const fs = require("fs");
const readline = require("readline");

// Constants
const CONTRACT_NAME = "LilNounsOracle";
const COMPILER_OUTPUT_PATH = "../artifacts/" + CONTRACT_NAME + ".sol/" + CONTRACT_NAME + ".json";
const GWEI = ethers.BigNumber.from(1000000000);
const NETWORK_NAME = network.name;
const CONSTRUCTOR_ARGS = {
  "mainnet" : [
      "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B", // token
      "0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E", // auction
      "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515", // seeder
      "0xb2a47999b3117c7dD628920ED8e77eBDfB948B68", // descriptor
  ],
  "localhost" : [
      "0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B",
      "0x55e0F7A3bB39a28Bd7Bcc458e04b3cF00Ad3219E",
      "0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515",
      "0xb2a47999b3117c7dD628920ED8e77eBDfB948B68",
  ],
  "rinkeby": [
    "0xF0ea2Ef2E31c9A4A74471cA6101BD755262c940a",
    "0x91BACcA4AC068fddBBAA0ABfa00E1718Baa6f047",
    "0x4451D889B6B8c9b0f11E3C9C2d5d27ddF4057a00",
    "0x43D17060Bd13a1DBb18aE54958C13eEccbf2017B"
  ]
};
const constructorArgs = CONSTRUCTOR_ARGS[NETWORK_NAME]

// Helpers
const readlineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (query) =>
  new Promise((resolve) => readlineInterface.question(query, resolve));

const etherscanVerify = (contractAddress, chainId) => {
  console.log("Attempting to verify with etherscan...");
  let command =
    "forge verify-contract" +
    " --chain " +
    chainId +
    ' --constructor-args $(cast abi-encode "constructor(address,address,address,address)" ' + constructorArgs[0] + ' ' + constructorArgs[1] + ' ' + constructorArgs[2] + ' ' + constructorArgs[3] + ')' + 
    " " +
    contractAddress +
    " src/" +
    CONTRACT_NAME +
    ".sol:" +
    CONTRACT_NAME +
    " $ETHERSCAN_API_KEY";

  console.log("Run this command to verify:\n");
  console.log(command);
  console.log("Then run this to check on verification result:\n");
  console.log("forge verify-check --chain-id " + chainId + " <GUID>");
};

const confirmDeploy = async () => {
  console.log('Attempting to deploy to network "' + NETWORK_NAME + '"...');
  if (NETWORK_NAME !== "localhost") {
    const response = await promptUser(
      "You are attempting to deploy on a non-local network, " +
        NETWORK_NAME +
        ", " + " with a target gas price of " + targetGasPriceGwei * GWEI  + " gwei. " + 
        "Continue? yes/no "
    );
    console.log(response);
    if (response !== "yes") {
      console.log("Aborting deploy due to user input.");
      process.exit(0);
    }
  }

}

const confirmGasPrice = async () => {
  return ethers.BigNumber.from(await promptUser('What is your desired gas price in gwei?')) // * GWEI
}

// Entrypoint
async function main() {
  await confirmDeploy()
  const targetGasPriceGwei = await confirmGasPrice()
  const targetGasPriceWei = targetGasPriceGwei.mul(GWEI)

  // Create contract factory
  const compilerOutput = require(COMPILER_OUTPUT_PATH);
  let factory = ethers.ContractFactory.fromSolidity(compilerOutput);
  const signer = await ethers.getSigner();
  factory = factory.connect(signer);

  // Every block check if the gasEstimate is low enough and deploy if it is
  ethers.provider.on("block", async (blockNumber) => {
    console.log();
    console.log("Block", blockNumber, "mined...");
    const gasPriceEstimateWei = ethers.BigNumber.from(
      await ethers.provider.getGasPrice()
    );
    const gasPriceEstimateGwei = ethers.utils.formatUnits(
      gasPriceEstimateWei,
      "gwei"
    );

    console.log("Current gas price:", gasPriceEstimateGwei, "gwei.");
    console.log("Target gas price: ", targetGasPriceGwei.toString(), "gwei.");
    if (gasPriceEstimateWei.lte(targetGasPriceWei)) {
      console.log("Gas price low enough! Starting deploying...");
      ethers.provider.removeAllListeners("block");

      // Deploy contract
      const deployedContract = await factory.deploy(...constructorArgs);
      console.log(
        "Deployed contract to",
        deployedContract.address + ".",
        "Cost",
        deployedContract.deployTransaction.gasLimit.toString(),
        " gas (",
        ((deployedContract.deployTransaction.gasLimit * gasPriceEstimateGwei) / GWEI).toString(),
        "ether at 10 gwei/gas unit.)"
      );

      // Fetch previous deployment configurations
      let deployments = JSON.parse(fs.readFileSync('./deployments/LilNounsOracle.json'))
      deployments[NETWORK_NAME] = {
        address: deployedContract.address,
        abi: compilerOutput.abi,
      }

      // Update the config with the deployed contract
      // Write out deploy artifacts
      fs.writeFileSync("./deployments/LilNounsOracle.json", JSON.stringify(deployments, null, 2))
      console.log("Updated deployment json file.");

      if (NETWORK_NAME !== "localhost") {
        etherscanVerify(deployedContract.address, network.config.chainId);
      }
      process.exit(0);
    }
  });
}

main();
