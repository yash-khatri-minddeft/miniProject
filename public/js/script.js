var provider, signer, account, walletConnected, chainId;
const CONTRACT_ADDRESS = '0xa42F2a333B928F5fc4524FB1D3b6afd49736b583';
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "productSeller",
				"type": "address"
			}
		],
		"name": "offerAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "offerMaker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "offerAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "offerAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "offerID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "productSeller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "offerMaker",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "baseAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "offerAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "paymentType",
				"type": "string"
			}
		],
		"name": "offerClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "productName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "productPrice",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "productImage",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "time",
				"type": "uint256"
			}
		],
		"name": "productAddedd",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_offerID",
				"type": "uint256"
			}
		],
		"name": "acceptOffer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_productName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_productPrice",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_productImage",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_productDesc",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isToken",
				"type": "bool"
			}
		],
		"name": "addProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_offerID",
				"type": "uint256"
			}
		],
		"name": "claimOfferWithEth",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_offerID",
				"type": "uint256"
			}
		],
		"name": "claimOfferWithToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_offerID",
				"type": "uint256"
			}
		],
		"name": "getAcceptance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "didAccept",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "offerID",
				"type": "uint256"
			}
		],
		"name": "getOffer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "productID",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "offerMaker",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "offerAmount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					}
				],
				"internalType": "struct LOLX.offersData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "productID",
				"type": "uint256"
			}
		],
		"name": "getProduct",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "productOwner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "productName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "productPrice",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "productImage",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "productDesc",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "time",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "isToken",
						"type": "bool"
					}
				],
				"internalType": "struct LOLX.productData",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_offerID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_productID",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "offerAmount",
				"type": "uint256"
			}
		],
		"name": "makeOffer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const TOKEN_ADDRESS = "0x44d780fc342eEDC1710F82FBA4BCE46FEb10A4ed";
const TOKEN_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMintFees",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
var LOLContract, TokenContract;

const btn = document.getElementById('connect-wallet');
const loader = document.querySelector('.loader');
window.addEventListener('load', async (e) => {
	await isConnected();
	await initContract();
	await getProducts().then(() => removePreloader());
	await addProducts().then(() => removePreloader());
	await getUserProduct().then(async () => {
		setTimeout(async () => {
			await sortOffers();
		}, 200)

		removePreloader()
	})
	await getOffers().then(() => removePreloader());
	await getTokens().then(() => removePreloader());

	// on button click connect metamask
	btn.addEventListener('click', async () => {
		if (window.ethereum) {
			provider = new ethers.providers.Web3Provider(window.ethereum);
			await provider.send("eth_requestAccounts", []);
			signer = provider.getSigner();
			account = (await signer.getAddress()).toLowerCase();
			btn.setAttribute('disabled', 'disabled')
			window.location.reload();
		}
	})

	// on account change
	window.ethereum.on('accountsChanged', async (accounts) => {
		window.location.reload()
	})
})
async function isConnected() {
	const accounts = await ethereum.request({ method: 'eth_accounts' });
	if (accounts.length) {
		provider = new ethers.providers.Web3Provider(window.ethereum);
		signer = provider.getSigner();
		// chainId = provider._network.chainId;
		const chainId = (await provider.getNetwork()).chainId;
		account = accounts[0].toLowerCase();
		btn.setAttribute('disabled', 'disabled')
		walletConnected = true;
	} else {
		walletConnected = false;
	}
}

const initContract = async () => {
	if (walletConnected) {
		LOLContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
		TokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
		btn.innerHTML = "connected to " + account.substring(0, 7) + '...' + (account.substring(account.length - 5));
	}
}
const getProducts = async () => {
	var productSection = document.querySelector('.product-section .row')
	if (productSection !== null) {
		if (walletConnected) {
			if (LOLContract) {
				// const products = await LOLContract.getAllProducts();
				fetch('/get-products', {
					method: 'post',
					body: JSON.stringify({
						owner: account
					}),
					headers: {
						'Content-type': 'application/json'
					}
				})
					.then((response) => response.json())
					.then((products) => {
						var product = products.product;
						if (product.length) {
							productSection.innerHTML = '';
							for (var i = 0; i < product.length; i++) {
								var tokenName;
								if (product[i].isToken) {
									tokenName = 'LOL';
								} else {
									tokenName = 'ETH';
								}
								var formHTML = '';
								//check if product is already bought
								if (product[i].buyer == 'null') {
									formHTML = ` <form method="post" class="make-offer-form" action="javascript:void(0);" data-product-id="${product[i].product}" onsubmit="makeOffer(event,${product[i].isToken})">
									<input type="number" min="0" step="0.00001" name="offer" id="offer">
									<button type="submit" class="btn btn-success">Make Offer</button>
								</form>`
								} else {
									formHTML = `<p>Product bought by ${product[i].buyer}</p>`
								}
								let date = new Date(product[i].time);
								let dateFormat = date.toDateString();
								productSection.innerHTML += `<div class="col-md-4">
                  <div class="product-card">
                    <div class="product-image">
                      <img src="${product[i].url}" class="img-fluid" alt="">
                    </div><!-- /.product-image -->
                    <div class="product-content">
                      <h4 class="product-name">
                        ${product[i].name}
                      </h4>
                      <div class="product-price">${product[i].price} ${tokenName}</div>
                      <p>${product[i].description}</p>
												${formHTML}
                      <div class="product-meta">
                        <span class="location">${product[i].location}</span>
                        <span class="time">${dateFormat}</span>
                      </div>
                    </div><!-- /.product-content -->
                  </div><!-- /.product-card -->
                </div>`;
							}
						} else {
							productSection.innerHTML = 'There is no product to show right now'
						}
					})
			}
		} else {
			productSection.innerHTML = 'Please login with wallet to see products';
		}
	}
}

var image;
const imageEle = document.getElementById('imageURL')
if (imageEle) {

	imageEle.addEventListener('change', (event) => {
		if (event.target.files.length > 0) {
			image = event.target.files[0];
			var src = URL.createObjectURL(event.target.files[0]);
			var preview = document.getElementById("file-ip-1-preview");
			preview.src = src;
			preview.style.display = "block";
			preview.style.marginBottom = "10px";
			preview.style.height = "100px";

		}
	})
}

const addProducts = async () => {
	const addProductForm = document.getElementById('add-product-form');
	if (addProductForm !== null) {
		if (walletConnected) {
			addProductForm.addEventListener('submit', async (e) => {
				e.preventDefault();
				loader.style.display = 'block';
				loader.style.opacity = '0.8';
				const name = document.getElementById('name').value;
				const price = document.getElementById('price').value;
				const description = document.getElementById('description').value;
				const isToken = document.querySelector('input[name="isToken"]:checked').value;
				// return false;
				const location = document.getElementById('location').value;

				const imageData = new FormData();
				imageData.append('image', image);

				try {
					const imageResponse = await fetch('/upload-image', {
						method: 'POST',
						body: imageData,
					})


					const imageIPFS = await imageResponse.json()
					const imageIPFSLink = imageIPFS.response;
					try {
						const productID = Date.now() + parseInt(Math.random() * 10000000000000);
						const tx = await LOLContract.addProduct(productID, name, ethers.utils.parseEther(price.toString()), imageIPFSLink, description, location, parseInt(isToken))
						await tx.wait(1)
						const response = fetch('/add-product', {
							method: 'post',
							body: JSON.stringify({
								product: productID,
								name: name,
								owner: account,
								price: price,
								url: imageIPFSLink,
								description: description,
								location: location,
								isToken: isToken
							}),
							headers: {
								'Content-type': 'application/json'
							}
						})
							.then((response) => response.json())
							.then(async (data) => {
								alert(data.message)
								loader.style.display = 'none';
								loader.style.opacity = '0';
								addProductForm.reset()
								var preview = document.getElementById("file-ip-1-preview");
								preview.setAttribute('src', '');
								preview.style.display = 'none';
							})
					} catch (err) {
						alert('there was an error while adding the product')
						console.log(err)
					}
				} catch (err) {
					alert('error occured')
					console.log(err)
				}
			})
		} else {
			addProductForm.outerHTML = 'Please connect metamask first to add products'
		}
	}
};

async function makeOffer(event, isToken) {
	event.preventDefault();

	loader.style.display = 'block';
	loader.style.opacity = '0.8';
	const getAmount = event.target.querySelector('input').value;
	const productId = event.target.getAttribute('data-product-id')
	try {
		fetch('/get-next-offer-count', {
			method: 'GET'
		}).then((res) => res.json())
			.then(async (offer) => {
				console.log(offer.next)
				if (isToken) {
					const giveAllowence = await TokenContract.approve(LOLContract.address, ethers.utils.parseEther(getAmount.toString()));
					await giveAllowence.wait(1)
				}
				const makeOffer = await LOLContract.makeOffer(offer.next, productId, ethers.utils.parseEther(getAmount.toString()))
				await makeOffer.wait(1);

				const data = fetch('/make-offer', {
					method: "post",
					body: JSON.stringify({
						productID: productId,
						offerMaker: account,
						offerAmount: getAmount
					}),
					headers: {
						'Content-type': 'application/json'
					}
				}).then((res) => res.json())
					.then(async (data) => {
						alert(data.message)
						loader.style.display = 'none';
						loader.style.opacity = '0';
					})
			})
	} catch (err) {
		console.log(err)
		throw (err)
	}
}

const getUserProduct = async () => {
	const userProducts = document.querySelector('.my-products .row');
	if (userProducts !== null) {
		if (walletConnected) {
			fetch('/get-user-product', {
				method: 'POST',
				body: JSON.stringify({
					owner: account
				}),
				headers: {
					'Content-type': 'application/json'
				}
			}).then((res) => res.json())
				.then((data) => {
					userProducts.innerHTML = '';
					if (data.userProducts.length) {
						data.userProducts.forEach(userProduct => {
							if (userProduct) {
								const time = new Date(userProduct.time);
								const productTime = time.toDateString();
								const productID = userProduct.product;
								var offerHTML = '';

								fetch('/get-offers', {
									method: 'POST',
									body: JSON.stringify({
										productId: productID
									}),
									headers: {
										'Content-type': 'application/json'
									}
								}).then((res) => res.json())
									.then((data) => {
										if (data.offers.length) {
											offerHTML = '';
											for (var i = 0; i < data.offers.length; i++) {
												//check if product is on pending
												var isPending = '';
												if (userProduct.isPending) {
													isPending = 'disabled="disabled"';
												}
												offerHTML += `
													<div class="accordion-item" data-offer="${data.offers[i].offerAmount}">
														<h2 class="accordion-header" id="heading${data.offers[i].offer}">
															<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${data.offers[i].offer}" aria-expanded="true aria-controls="collapse${data.offers[i].offer}">
																Offer Item #${data.offers[i].offer}
															</button>
														</h2>
														<div id="collapse${data.offers[i].offer}" class="accordion-collapse collapse show" aria-labelledby="heading${data.offers[i].offer}" >
															<div class="accordion-body">
																<div class="offer-detail">
																	<div class="offer-detail-inner">
																		<h4>Offer Price:</h4>
																		<span>${data.offers[i].offerAmount}</span>
																	</div>
																	<div class="offer-detail-inner">
																		<h4>Offer Maker:</h4>
																		<span>${data.offers[i].offerMaker}</span>
																	</div>
																	<div class="offer-detail-inner">
																		<button class="btn btn-success" onclick="acceptOffer(${data.offers[i].offer})" ${isPending}>Accept Offer</button>
																	</div>
																</div>
															</div>
														</div>
													</div>
													`
											}
										} else {
											offerHTML = `no offers for ${productID}`
										}
										var time = new Date(userProduct.time);
										var productTime = time.toDateString()
										userProducts.innerHTML += `
											<div class="col-md-12">
												<div class="offer-product">
													<div class="offer-product-upper">
														<div class="offer-product-image">
															<img src="${userProduct.url}" class="img-fluid" alt="">
														</div>
														<div class="offer-product-details">
															<div class="offer-meta">
																<h4>NAME: </h4>
																<span>${userProduct.name}</span>
															</div>
															<div class="offer-meta">
																<h4>Price: </h4>
																<span>${userProduct.price}</span>
															</div>
															<div class="offer-meta">
																<h4>Date: </h4>
																<span>${productTime}</span>
															</div>
														</div>
													</div>
													<div class="accordion" id="accordion-${productID}">
														${offerHTML}
														</div>
												</div>
											</div><!--./col-->
											`;
									})
							} else {
								userProducts.innerHTML = 'All of your products are sold';
							}

						});
					} else {
						userProducts.innerHTML = 'You don\'t have any product';
					}
				})
		} else {
			userProducts.innerHTML = 'Please login with metamask to see your product which are on sale'
		}
	}
}

const acceptOffer = async (offerId) => {
	loader.style.display = 'block';
	loader.style.opacity = '0.8';
	try {
		const acceptOffer = await LOLContract.acceptOffer(offerId);
		await acceptOffer.wait(1);
		fetch('/accept-offer', {
			method: 'POST',
			body: JSON.stringify({
				offerId: offerId
			}),
			headers: {
				'Content-type': 'application/json'
			}
		}).then((res) => res.json())
			.then((data) => {
				alert(data.message)
				loader.style.display = 'none';
				loader.style.opacity = '0';
				window.location.reload();
			})
	} catch (err) {
		console.log(err);
		throw err;
	}
}

const getOffers = async () => {
	const myOffers = document.querySelector('.my-offers .row');
	if (myOffers != null) {
		fetch('/my-offers', {
			method: "POST",
			body: JSON.stringify({
				account: account
			}),
			headers: {
				'Content-type': 'application/json'
			}
		}).then((res) => res.json())
			.then((result) => {
				if (result.offers.length) {
					result.offers.forEach(offer => {
						// console.log(offer)
						// console.log(offer.product)
						myOffers.innerHTML = '';
						fetch('/get-product-by-id', {
							method: "POST",
							body: JSON.stringify({
								productId: offer.product
							}),
							headers: {
								'Content-type': 'application/json'
							}
						}).then((res) => res.json())
							.then((data) => {
								if (data.product) {
									myOffers.innerHTML += `
									<div class="col-md-12">
										<div class="claim-offer">
											<h4>Product ID: ${data.product.product}</h4>
											<h4>Product Name: ${data.product.name}</h4>
											<h4>Your Price: ${offer.offerAmount}</h4>
											<img src="${data.product.url}" class="img-fluid" style="margin-top: 20px;margin-bottom: 20px;" alt="">
											<p>Your offer has been approved click below button to claim it</p>
											<button class="btn btn-success" onclick="claimOffer(${offer.offer},${data.product.isToken},${offer.offerAmount})">Claim Offer</button>
										</div>
									</div>`;
								} else {
									myOffers.innerHTML = 'No active offers Found';
								}
							})
					})
				} else {
					myOffers.innerHTML = 'No offers Found'
				}
			})
	}
}
const claimOffer = async (offerId, isToken, offerAmount) => {
	loader.style.display = 'block';
	loader.style.opacity = '0.8';
	try {
		if (isToken) {
			const tx = await LOLContract.claimOfferWithToken(offerId);
			await tx.wait(1);
		} else {
			EthAmount = ethers.utils.parseEther(offerAmount.toString());
			const tx = await LOLContract.claimOfferWithEth(offerId, { value: EthAmount })
			await tx.wait(1);
		}
		fetch('/claim-offer', {
			method: 'POST',
			body: JSON.stringify({
				offerId: offerId
			}),
			headers: {
				'Content-type': 'application/json'
			}
		}).then((res) => res.json())
			.then(async (data) => {
				loader.style.display = 'none';
				loader.style.opacity = '0';
				console.log(data.product);
				window.location.reload()
			})
	} catch (err) {
		console.log(err);
		throw err;
	}
}

// get tokens
const getTokens = async () => {
	const tokenEle = document.getElementById('LOLTokens');
	const EthEle = document.getElementById('ETH');
	try {
		if (tokenEle !== null) {
			const tokenAmount = await TokenContract.balanceOf(account);
			tokenEle.innerHTML = ethers.utils.formatEther(tokenAmount.toString()) + ' LOL';
		}
		if (EthEle) {
			const EthBalance = await signer.getBalance();
			EthEle.innerHTML = ethers.utils.formatEther(EthBalance.toString()) + ' ETH';
		}
	} catch (err) {
		console.log(err);
		throw err;
	}
}

//mint token form
const mintTokenForm = document.getElementById('token-form');
if (mintTokenForm !== null) {
	mintTokenForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		const loader = document.querySelector('.loader');
		loader.style.display = 'block';
		loader.style.opacity = '0.8';
		const tokenAmount = document.getElementById("tokenAmount").value;
		const MINT_FEES = await TokenContract.getMintFees();
		const ethValue = tokenAmount * MINT_FEES;
		console.log(ethValue)
		console.log(MINT_FEES.toString())
		// return false;
		try {
			const mintToken = await TokenContract.mint(tokenAmount, { value: ethValue })
			await mintToken.wait(1);
		} catch (err) {
			console.log(err);
			throw err;
		}
		loader.style.display = 'none';
		loader.style.opacity = '0';
		window.location.reload();
	})
}
const sortOffers = async () => {
	const accordianGroups = document.querySelectorAll('.accordion');
	// console.log(accordianGroup)
	accordianGroups.forEach((accordianGroup) => {
		var indexes = accordianGroup.querySelectorAll("[data-offer]");
		var indexesArray = Array.from(indexes);
		let sorted = indexesArray.sort(function (a, b) {
			return +b.dataset.offer - +a.dataset.offer
		});
		accordianGroup.innerHTML = '';
		sorted.forEach(e => { accordianGroup.appendChild(e); })
	})
}

const removePreloader = () => {
	loader.classList.add('loaded');
	setTimeout(() => {
		loader.style.display = 'none';
	}, 500)
}