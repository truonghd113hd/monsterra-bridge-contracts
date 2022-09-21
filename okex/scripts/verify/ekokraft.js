const console = require("console")
const hre= require("hardhat")
const fs = require("fs");

// Define the NFT

async function main() {
    const file = fs.readFileSync('.openzeppelin/unknown-43113.json', 'utf8');
    const data = JSON.parse(file);

    try{
        impls = data["impls"]
        const last = Object.keys(impls).pop();
         contract_addr = impls[last]["address"];
         console.log(`Verify contract: ${contract_addr}`)
    }
    catch{
        console.log("Please check the deployement file");
        process.exit(1);
    }
   

    await hre.run('verify:verify', {
        address: contract_addr,
        constructorArguments: [
            
        ],
        contract: "contracts/Ekokraft.sol:Ekokraft"
    })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })