const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const data = JSON.parse(file);

  const contract = await hre.ethers.getContractFactory("MSTRToken");
  console.log(`Minter: ${data.address}`)

  const trk = await contract.deploy(
    data.address
  );

  await trk.deployed();
  data["mstr"] = trk.address
  // write address to file
  
  fs.writeFileSync(
    "./data/ekokraft.json",
    JSON.stringify(data)
  );

  console.log("MSTR Contract deployed to:", trk.address);

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
