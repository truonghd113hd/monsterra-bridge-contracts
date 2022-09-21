const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  signer_wallet = "0x0c940F3E311C19c1563798b2c57A4d50C8Bcca74"

  
  const deployed_url =  'data/monsterra.json';
  const contract_file = fs.readFileSync(deployed_url, 'utf8');
  const contract_data = JSON.parse(contract_file);

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");
  console.log(".... Get Monsterra contract for inital setting ....");

  let contract = await ethers.getContractAt('Monsterra', contract_data.address);
  // set signer 
  
  await contract.setSigner(signer_wallet)
  console.log(`Set signer successfully ${signer_wallet}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });