const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const data = JSON.parse(file);

  let contract = await ethers.getContractAt('MAGToken', "0xFcB7509745BcA18BE41C48a58A9981BAA56D22a4");

  let minter = await contract.minter();
  console.log(minter)
  // write address to file
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
