const hre = require('hardhat')

async function main() {
  const [deployer] = await hre.ethers.getSigners()
  console.log('Deployer:', deployer.address)

  const name = process.env.NFT_NAME || 'CodexMintNFT'
  const symbol = process.env.NFT_SYMBOL || 'CMN'

  const BasicNFT = await hre.ethers.getContractFactory('BasicNFT')
  const contract = await BasicNFT.deploy(name, symbol)
  await contract.deployed()

  console.log('BasicNFT deployed to:', contract.address)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

