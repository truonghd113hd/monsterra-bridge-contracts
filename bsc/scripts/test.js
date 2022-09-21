const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  const contractAddress = process.env.MONSTERA_CONTRACT;
  const contract = await ethers.getContractAt('Monstera', contractAddress);

  
  console.log(".... Get Monstera contract for inital setting ....");

  let data = await contract.unlock(
    "kientest1",
    "0x2052E1E022DceDEca3aF6Df6c4374f72A45dC867",
    "terra1pqdcamwrnmhd0fxqxmcsrj6fnlyewnzd408rrf",
    "0x7149C2Ee2196fBFC68B8e5504A87f907DbABF50a",
    "0x7149C2Ee2196fBFC68B8e5504A87f907DbABF50a",
    "1",
    "0x8cfb7892a5564d1e875a26d9f5139a77bb523eee071c238c4572eb51db68a9bc6bcb3eea3a8100f16b83b425bfafc85f6f666315b01b29253234bf3cd17f90dd1b"
  )
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });