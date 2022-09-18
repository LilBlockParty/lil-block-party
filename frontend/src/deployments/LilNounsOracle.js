import LilNounsOracleDeployments from './LilNounsOracle.json'

const network = process.env.NETWORK ? process.env.NETWORK : "mainnet" 
console.log(LilNounsOracleDeployments[network])
export const LilNounsOracle = LilNounsOracleDeployments[network]
