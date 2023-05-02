require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18"
  },
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/0e5965b9969148259a13088b49a7c492',
      accounts: process.env.ACCOUNT_SECRET_KEY.split(',')
    }
  },
  etherscan: {
    apiKey: {
      sepolia: 'NU5ZVQY6E31GIRRNGBEB5I8PU4M5HVH1W1'
    }
  }
};
