// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LOLToken is ERC20, Ownable {
    constructor() ERC20("LOLToken", "LOL") {}

    uint256 constant private MINT_FEES = 0.00001 ether;

    function mint(uint256 amount) public payable {
        require(amount * MINT_FEES == msg.value,"Please pay some ethers to mint Token");
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function getMintFees() pure public returns(uint256) {
        return MINT_FEES;
    }
}