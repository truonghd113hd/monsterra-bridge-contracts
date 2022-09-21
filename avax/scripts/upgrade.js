const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  const contract_file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const contract_data = JSON.parse(contract_file);

  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");

  const poolAddress = "0x1263B40509A1C5410CaCACDE1eB885d12d8b7b2D";
  if (!poolAddress) {
    console.log("Pool address not found");
    return;
  }

  // Get contract factory
  const NewPoolFactory = await ethers.getContractFactory(
    'Ekokraft',
  );
  // Upgrade contract proxy
  const tx = await upgrades.upgradeProxy(poolAddress, NewPoolFactory);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
