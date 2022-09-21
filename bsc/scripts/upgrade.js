const hardhat = require('hardhat');
const { ethers, upgrades } = hardhat;

async function main() {
  const [deployer] = await ethers.getSigners();

  const poolAddress = process.env.MONSTERA_CONTRACT;
  if (!poolAddress) {
    console.log("Pool address not found");
    return;
  }

  // Get contract factory
  const NewPoolFactory = await ethers.getContractFactory(
    'Monstera',
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
