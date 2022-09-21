require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

module.exports = {
 solidity: "0.8.10",
 networks: {
  bsc: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    accounts: [process.env.PRIVATE_KEY],
    // gas: 2100000,
    // gasPrice: 8000000000
  },
 
 },
 etherscan: {
   apiKey: process.env.BSC_API
 },
};