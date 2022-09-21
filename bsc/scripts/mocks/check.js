const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const data = JSON.parse(file);

  let contract = await ethers.getContractAt('MAGToken', "0x923a6fEC7f02F9330FbcE0249f90F555618549d0");

  await contract.mint("0xF124213F70FDd58f794A1c5ff5fa17a24ce587a0", "1000000000000000000000")
  // write address to file
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
