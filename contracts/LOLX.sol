// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

pragma solidity ^0.8.18;
contract LOLX is Ownable {

	address public tokenAddress;

	constructor(address _tokenAddress) {
		tokenAddress = _tokenAddress;
	}
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
	struct offersData {
		uint256 productID;
		address offerMaker;
		uint256 offerAmount;
		uint256 time;
	}
	mapping(uint256 productID => productData) private products;
	mapping(uint256 offerID => offersData) private offers;
	mapping(uint256 offerID => bool isAccepted) private isAccepted;

	//events
	event productAddedd(uint256 indexed productID, address owner, string productName, uint256 productPrice, string productImage, uint256 time);
	event offerAdded(uint256 indexed offerID, uint256 indexed productID, address offerMaker, uint256 offerAmount, uint256 time);
	event offerAccepted(uint256 indexed offerID, uint256 indexed productID, address productSeller);
	event offerClaimed(uint256 indexed productID, uint256 indexed offerID, address productSeller, address offerMaker, uint256 baseAmount, uint256 offerAmount, string paymentType);

	function addProduct(uint256 productID, string memory _productName, uint256 _productPrice, string memory _productImage,string memory _productDesc, string memory _location, bool _isToken ) public {
		products[productID] = productData(msg.sender, _productName, _productPrice, _productImage, _productDesc, _location, block.timestamp, _isToken);

		emit productAddedd(productID, msg.sender, _productName, _productPrice, _productImage, block.timestamp);
	}
	function getProduct(uint256 productID) view public returns(productData memory) {
		return products[productID];
	}

	function makeOffer(uint256 _offerID, uint256 _productID, uint256 offerAmount) public {
		address productSeller = products[_productID].productOwner;
		require(msg.sender != productSeller,"Seller can't make offer to is own product");
		offers[_offerID] = offersData(_productID, msg.sender, offerAmount, block.timestamp);
		emit offerAdded(_offerID, _productID, msg.sender, offerAmount, block.timestamp);
	}
	function getOffer(uint256 offerID) view public returns(offersData memory) {
		return offers[offerID];
	}

	function acceptOffer(uint256 _offerID) public {
		uint256 productId = offers[_offerID].productID;
		address productOwner = products[productId].productOwner;
		require(msg.sender == productOwner, "you can't accept the offer as you are not the product owner");
		isAccepted[_offerID] = true;
		emit offerAccepted(_offerID, productId, productOwner);
	}
	
	function getAcceptance(uint256 _offerID) view public returns(bool didAccept) {
		didAccept = isAccepted[_offerID];
	}

	modifier checkUserAndAcceptence(uint256 _offerID) {
		address offerMaker = offers[_offerID].offerMaker;
		require(msg.sender == offerMaker,"You are wrong person to claim the offer");
		require(isAccepted[_offerID] == true, "The Seller has not accepted yout offer yet.");
		_;
	}

	function claimOfferWithToken(uint256 _offerID) public checkUserAndAcceptence(_offerID) {
		(address offerMaker,uint256 productId, address productSeller, uint256 baseAmount, uint256 offerAmount) = getOfferValues(_offerID);
		require(products[productId].isToken == true, "Payment method is Ethers only");

		IERC20(tokenAddress).transferFrom(offerMaker, productSeller, offerAmount);
		emit offerClaimed(productId, _offerID, productSeller, offerMaker, baseAmount, offerAmount, "LOL");
	}

	function claimOfferWithEth(uint256 _offerID) public payable checkUserAndAcceptence(_offerID) {
		(address offerMaker,uint256 productId, address productSeller, uint256 baseAmount, uint256 offerAmount) = getOfferValues(_offerID);
		require(products[productId].isToken == false, "Payment method is Token only");

		require(offerAmount == msg.value, "Incorrect ETH Value");
		(bool isClaimed, ) = productSeller.call{value: msg.value}("");
		require(isClaimed,"Can't claim product, error occured");
		emit offerClaimed(productId, _offerID, productSeller, offerMaker, baseAmount, offerAmount, "ETH");
	}

	function getOfferValues(uint256 _offerID) private view returns(address offerMaker,uint256 productId, address productSeller, uint256 baseAmount, uint256 offerAmount) {
		offerMaker = offers[_offerID].offerMaker;
		productId = offers[_offerID].productID;
		productSeller = products[productId].productOwner;
		baseAmount = products[productId].productPrice;
		offerAmount = offers[_offerID].offerAmount;
	}
	function getToken() view public returns(uint256) {
		return IERC20(tokenAddress).balanceOf(msg.sender);
	}
}