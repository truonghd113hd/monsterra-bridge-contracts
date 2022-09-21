const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();


async function main() {
  const deployed_url =  'data/monsterra.json';
  const contract_file = fs.readFileSync(deployed_url, 'utf8');
  const contract_data = JSON.parse(contract_file);

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");
  console.log(".... Get Monsterra contract for inital setting ....");

  let contract = await ethers.getContractAt('Monsterra', contract_data.address);

  const file = fs.readFileSync('./data/tokens.json', 'utf8');
  const data = JSON.parse(file);

  for (network in data) {
    if (network == "bsc"){
      for (let key in data[network]){
          try{
            await contract.setAcceptedToken(data[network][key], true);
            console.log(`set ${key} token of ${network} successfully`)
          }catch{
            console.log(`Setting data for ${data[network][key]} failed`)
          }
      }
    }else{
      for (let key in data[network]){
        try{
          await contract.setAcceptedDesToken(data[network][key], true);
          console.log(`set ${key} token of ${network} BSC successfully`)
        }catch{
          console.log(`Setting data for ${data[network][key]} failed`)
        }
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