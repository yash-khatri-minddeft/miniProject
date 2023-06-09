const express = require('express');
const { mongoose } = require('mongoose');
const app = express();
const fs = require('fs')
const cors = require('cors');
const path = require('path')
const { Products, Offers } = require('./model');
const bodyParser = require('body-parser');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataApiKey: process.env.PINATA_API_Key, pinataSecretApiKey: process.env.PINATA_API_Secret });

app.use('/public', express.static(path.join(__dirname, '..', 'public')))


const expressjson = express.json();
app.use(cors({
    origin: '*'
}))
// app.use(express.json())
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', 'home'));
})
app.get('/my-products', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', '/my-product'))
})
app.get('/add-product', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', '/add-product'))
})
app.get('/my-offers', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', '/my-offers'))
})
app.get('/mint-tokens', (req, res) => {
    res.render(path.join(__dirname, '..', 'views', '/mintTokens'))
})
app.post('/add-product', expressjson, async (req, res) => {
    const { product, name, owner, price, url, description, location, isToken } = req.body;
    const new_product = new Products({
        product: product,
        name: name,
        owner: owner,
        price: price,
        url: url,
        description: description,
        time: new Date(),
        location: location,
        isToken: isToken
    })
    new_product.save().catch((err) => console.log(err)).then(() => res.json({ message: 'Product Added', product: new_product.product }))
    // new_product.save()
    // res.send('product addes')
})
app.post('/upload-image', expressjson, async (req, res) => {
    const imageUpload = req.files.image;
    imageUpload.mv(path.join(__dirname, '..', 'public', 'uploads', imageUpload.name)).then((err) => {
        if(err) throw err;
        const readFile = fs.createReadStream(path.join(__dirname, '..', 'public', 'uploads', imageUpload.name));
        const options = {
            pinataMetadata: {
                name: imageUpload.name,
            }
        }
        pinata.pinFileToIPFS(readFile, options).then((result) => {
            console.log(result)
            res.json({ response: 'https://ipfs.io/ipfs/' + result.IpfsHash })
        }).catch((err) => {
            throw err;
        })
    })
})
app.post('/get-product-by-id', expressjson, async (req, res) => {
    const productId = req.body.productId;
    const product = await Products.findOne({ product: productId, buyer: 'null' });
    res.json({ product: product });
})
app.post('/get-products', expressjson, async (req, res) => {
    const owner = req.body.owner;
    const products = await Products.find({ owner: { $ne: owner } });
    res.json({ product: products })
})
app.post('/make-offer', expressjson, (req, res) => {
    const { offerID, productID, offerMaker, offerAmount } = req.body;
    const newOffer = new Offers({
        offer: offerID,
        product: productID,
        offerAmount: offerAmount,
        offerMaker: offerMaker,
        time: new Date()
    })
    newOffer.save().catch((err) => { if (err) throw err; })
        .then(() => {
            const count = newOffer.offer;
            res.json({ message: 'Offer Placed', offer: count })
        })
})
app.post('/get-user-product', expressjson, async (req, res) => {
    const owner = req.body.owner;

    const userProducts = await Products.find({ owner: owner, buyer: 'null' })
    res.json({ userProducts: userProducts })
})
app.post('/get-offers', expressjson, async (req, res) => {
    const productId = req.body.productId;

    const offers = await Offers.find({ product: productId })
    res.json({ offers: offers });
})
app.post('/my-offers', expressjson, async (req, res) => {
    const account = req.body.account;
    const getOffers = await Offers.find({ offerMaker: account, isAccepted: true, isBought: false })
    res.json({ offers: getOffers })
})
app.post('/accept-offer', expressjson, async (req, res) => {
    const offerId = req.body.offerId;
    const findProduct = await Offers.findOne({ offer: offerId })
    const productId = findProduct.product;
    const filter = { product: productId };
    const update = { isPending: true }
    const updatedProduct = await Products.findOneAndUpdate(filter, update, { upsert: true })
    const offerAccepted = await Offers.findOneAndUpdate({ offer: offerId }, { isAccepted: true }, { upsert: true })
    res.json({ message: 'Offer accepted, now wait for respose from offer maker' })
})
app.post('/claim-offer', expressjson, async (req, res) => {
    const offerId = req.body.offerId;
    const offer = await Offers.findOne({ offer: offerId });
    const offerIsBought = await Offers.findOneAndUpdate({ offer: offerId }, { isBought: true }, { upsert: true });
    const product = await Products.findOneAndUpdate({ product: offer.product }, { isPending: false, buyer: offer.offerMaker }, { upsert: true })
    res.json({ message: 'Offer Claimed', product: offer.product })
})
app.get('/get-next-product-count', async (req, res) => {
    const product = await Products({});
    product.nextCount((err, count) => {
        res.json({ next: count })
    })
})
app.get('/get-next-offer-count', async (req, res) => {
    const product = await Offers({});
    product.nextCount((err, count) => {
        res.json({ next: count })
    })
})
app.get('/reset-counters', (req, res) => {
    const newproduct = new Products({})
    newproduct.resetCount((err, next) => {
        console.log(next)
    })

    const newoffer = new Offers({})
    newoffer.resetCount((err, next) => {
        console.log(next)
    })
    res.send('counter reset')
})
app.listen(4000, (err) => {
    mongoose.connect('mongodb+srv://yashkhatri:' + process.env.CLUSTER_PASSWORD + '@cluster0.pz95adm.mongodb.net/miniProject')
        .catch((err) => {
            if (err) throw err;
        })
        .then(() => {
            console.log('database connected')
        })
    if (err) throw err;
    console.log('server connected')
})
