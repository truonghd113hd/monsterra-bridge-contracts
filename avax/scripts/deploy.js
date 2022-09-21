const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {
  const Monsterra = await ethers.getContractFactory("Monsterra");

  const deployed_url =  'data/monsterra.json';

  const file = fs.readFileSync(deployed_url, 'utf8');
  const data = JSON.parse(file);

  const monsterra = await upgrades.deployProxy(Monsterra, [], {
    initializer: "initialize",
  }, {kind: 'uups'});
  await monsterra.deployed();


  data["address"] = monsterra.address
  // write address to file
  fs.writeFileSync(
    deployed_url,
    JSON.stringify(data)
  );
}

main();