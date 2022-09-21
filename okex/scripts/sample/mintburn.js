const { ethers, upgrades } = require("hardhat");
const fs = require('fs');

require('dotenv').config();

async function main() {
  const contract_file = fs.readFileSync('data/ekokraft.json', 'utf8');
  const contract_data = JSON.parse(contract_file);

  let deployer = await ethers.getSigner();
  console.log(deployer.address);


  if (!contract_data || !contract_data.address) throw new Error("Invalid JSON data");
  console.log(".... Get Ekokaft contract  ....");


  contract_addr = "0x1e554D224F719c6F2d890DFC87abfc7C62805B73"
  let contract = await ethers.getContractAt('Ekokraft',contract_addr);
  

   let internalTx_ = "62ea2c6a9a0099e4fb36b710"
   let cur_token = "0xA76c6a8fB2deA585B9E13aAa766A215861d58AE9"
   let des_token = "0xB78f0db43f08f90Fd354feD23E1bc376244a8107"
   let cur_user = "0x4a2A2EE116DA8c50110658a8e9713153DeA29B77"
   let des_user = "0x4a2A2EE116DA8c50110658a8e9713153DeA29B77"
   let amount = "10000000000000000000"

  const hash = await contract.getMessageHash(internalTx_, cur_token, des_token,cur_user, des_user, amount) ;
  const signature = await web3.eth.sign(hash, deployer.address);
  console.log(signature)
  process.exit(1)

  await contract.mint(internalTx_, cur_token, des_token, cur_user, des_user, amount, signature);

    let tx_id_2 = "kienburn1";
    let token = await ethers.getContractAt('MAGToken', cur_token);
    await token.approve(contract_addr, "1000")
    await contract.burn(tx_id_2, cur_token, des_token, des_user, amount);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });