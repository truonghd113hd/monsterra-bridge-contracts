const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  const contract_file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const contract_data = JSON.parse(contract_file);

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");

  let contract = await ethers.getContractAt('Ekokraft', contract_data.address);

  let status = await contract.acceptedDesTokens("terra1kdyaxujjyf034aqcaghc66sr4xgrevrxfwysguvn24hlszwknf3sarmpf0")
  console.log(status)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });