const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  const deployed_url =  'data/monsterra.json';
  const contract_file = fs.readFileSync(deployed_url, 'utf8');
  const contract_data = JSON.parse(contract_file);

  const token_data_url = './data/tokens.json'

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");
  console.log(".... Get Monsterra contract for validating setup ....");

  let contract = await ethers.getContractAt('Monsterra', contract_data.address);
  const file = fs.readFileSync(token_data_url, 'utf8');
  const data = JSON.parse(file);


  let signer = await contract.getSigner();
  console.log(`Signer of the contract is: ${signer} \n =========================\n`);
  
  for (network in data) {
    if (network == "avax"){
      for (let key in data[network]){
        let status = await contract.acceptedTokens(data[network][key]);
        console.log(`Accepted Token of ${network}: ${key} has status: ${status}`);
      }
    }else{
      for (let key in data[network]){
        let status = await contract.acceptedDesTokens(data[network][key]);
        console.log(`Accepted Des Token of ${network}: ${key} has status: ${status}`);
      }
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });