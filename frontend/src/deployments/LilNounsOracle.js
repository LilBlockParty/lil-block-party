import LilNounsOracleDeployments from './LilNounsOracle.json'

const network = process.env.NETWORK ? process.env.NETWORK : "mainnet" 
export const LilNounsOracle = LilNounsOracleDeployments[network]
