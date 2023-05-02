// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


pragma solidity ^0.8.18;
contract Product is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _productID;
    struct productData {
        address productOwner;
        string productName;
        uint256 productPrice;
        string productImage;
        string productDesc;
        string location;
        uint256 time;
        bool isToken;
    }
    struct offers {
        uint256 productID;
        address offerMaker;
        uint256 offerAmount;
        uint256 time;
    }
    mapping(uint256 productID => productData) public products;

    //events
    event productAddedd(uint256 indexed productID, address owner, string productName, uint256 productPrice, string productImage, uint256 time);
    event offerAdded(uint256 indexed productID, address offerMaker, uint256 offerAmount, uint256 time);

    function addProduct(string memory _productName, uint256 _productPrice, string memory _productImage,string memory _productDesc, string memory _location, bool _isToken ) public {
        uint256 productID = _productID.current();
        _productID.increment();
        products[productID] = productData(msg.sender, _productName, _productPrice, _productImage, _productDesc, _location, block.timestamp, _isToken);

        emit productAddedd(productID, msg.sender, _productName, _productPrice, _productImage, block.timestamp);
    }
    function getProduct(uint256 productID) view public returns(productData memory) {
        return products[productID];
    }
    function getAllProducts() public view returns(productData[] memory){
        productData[] memory ret = new productData[](_productID.current());
        for (uint256 i = 0; i < _productID.current(); i++) {
            ret[i] = products[i];
        }
        return ret;
    }
}