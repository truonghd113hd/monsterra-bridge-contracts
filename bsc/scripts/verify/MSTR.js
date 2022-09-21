const console = require("console")
const hre= require("hardhat")
const fs = require("fs");

async function main() {
    const file = fs.readFileSync('data/ekokraft.json', 'utf8');
    const data = JSON.parse(file);

    try{
        ekokraft_addr = data["address"]
        mstr_addr = data["mstr"]
    }
    catch{
        console.log("please check the deployement file");
        process.exit(1);
    }

    await hre.run('verify:verify', {
        address: mstr_addr,
        constructorArguments: [
            
        ],
        contract: "contracts/mocks/MSTR.sol:MSTRToken"
    })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })