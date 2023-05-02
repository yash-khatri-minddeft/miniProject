const { ethers } = require('hardhat');
describe("Product", () => {
  var LOL, Token, owner, accounts;
  beforeEach(async () => {
    [owner, ...accounts] = await ethers.getSigners();
    Token = await (await ethers.getContractFactory('LOLToken')).deploy();
    LOL = await (await ethers.getContractFactory('LOLX')).deploy(Token.address);
  })
  describe('test case', async () => {
    it('check product details added', async () => {
      const tx = await LOL.addProduct(101, "product 1", 200, "https://miro.medium.com/v2/resize:fit:640/0*XX86UHYVB1X0dmxE", "This is a good product", "Shaitan gali, khatra mahal, andher nagar", true);
      const tx2 = await LOL.connect(accounts[0]).addProduct(102, "product 2", 400, "https://miro.medium.com/v2/resize:fit:640/0*XX86UHYVB1X0dmxE", "This is a 2nd product", "Shaitan gali, khatra mahal, andher nagar ke paas", false);
      await Token.connect(accounts[1]).mint(1000, { value: ethers.utils.parseEther("0.01") })
      await LOL.makeOffer(101, 102, ethers.utils.parseEther("180"));
      await Token.connect(accounts[1]).approve(LOL.address, 1000)

      // await LOL.acceptOffer(101);
      // console.log(await LOL.getOffer(101))
      // console.log(await LOL.getProduct(101))
      // console.log(owner.address)
      await LOL.connect(accounts[0]).acceptOffer(101);
      // console.log(await LOL.getOffer(101))
      await LOL.claimOfferWithEth(101,{value: ethers.utils.parseEther("180")})
    })
  })
});
