require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

const AMOY_RPC_URL = process.env.AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology'
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    amoy: {
      url: AMOY_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
  },
  etherscan: {
    apiKey: { polygonAmoy: process.env.POLYGONSCAN_API_KEY || '' },
  },
}

