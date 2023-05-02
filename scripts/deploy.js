// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const main = async () =>  {
  const LOLToken = await (await ethers.getContractFactory('LOLToken')).deploy();
  console.log("token address:",await LOLToken.address)
  const LOL = await (await ethers.getContractFactory('LOLX')).deploy(LOLToken.address)
  const LOLAddress = await LOL.address;
  console.log("Contract address:",LOLAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
