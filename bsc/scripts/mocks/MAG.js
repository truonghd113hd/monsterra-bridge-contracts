const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const data = JSON.parse(file);

  const contract = await hre.ethers.getContractFactory("MAGToken");
  const trk = await contract.deploy(
  );
  await trk.deployed();
  
  data["mag"] = trk.address
  // write address to file
  
  fs.writeFileSync(
    "./data/ekokraft.json",
    JSON.stringify(data)
  );
  console.log("MAG Contract deployed to:", trk.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
