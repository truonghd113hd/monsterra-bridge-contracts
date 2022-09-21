const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  const contract_file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const contract_data = JSON.parse(contract_file);

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");
  console.log(".... Get Ekokaft contract for inital setting ....");

  let contract = await ethers.getContractAt('Ekokraft', contract_data.address);
  // set signer 
  signer_wallet = "0x7daae6f3682406842539d2CE35134f5b8283B5b6"
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