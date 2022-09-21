require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
 solidity: "0.8.2",
 networks: {
  
  okex: {
    url: "https://exchaintestrpc.okex.org",
    accounts: [process.env.PRIVATE_KEY],
  }
 },
 etherscan: {
   apiKey: process.env.FUJI_API
 },
};