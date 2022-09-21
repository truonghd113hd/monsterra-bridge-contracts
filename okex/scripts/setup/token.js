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
  console.log(".... Get Monsterra contract for inital setting ....");

  let contract = await ethers.getContractAt('Monsterra', contract_data.address);

  const file = fs.readFileSync(token_data_url, 'utf8');
  const data = JSON.parse(file);

  for (network in data) {
    if (network == "avax"){
      for (let key in data[network]){
          try{
            await contract.setAcceptedToken(data[network][key], true);
            console.log(`set ${key} token of ${network} successfully`)
          }catch{
            console.log(`Setting data for ${data[network][key]} failed`)
          }
          await delay(2000);
      }
    }else{
      for (let key in data[network]){
        try{
          await contract.setAcceptedDesToken(data[network][key], true);
          console.log(`set ${key} destination token of ${network} successfully`)
        }catch{
          console.log(`Setting data for destination token ${data[network][key]} failed`)
        }
        await delay(2000);
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