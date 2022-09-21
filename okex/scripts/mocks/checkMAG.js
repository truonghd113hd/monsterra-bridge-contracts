const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const data = JSON.parse(file);

  let contract = await ethers.getContractAt('MSTRToken', "0x99dCd92E191e173Dd765584eB07240610Bc1Fcb4");

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
