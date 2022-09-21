require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
 solidity: "0.8.2",
 networks: {
  
  avax: { // fuji
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    accounts: [process.env.PRIVATE_KEY],
  }
 },
 etherscan: {
   apiKey: process.env.FUJI_API
 },
};