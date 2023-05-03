const { mongoose, mongo } = require('mongoose');
const autoIncrement = require('@alec016/mongoose-autoincrement');
require('dotenv').config();

mongoose.connect('mongodb+srv://yashkhatri:'+process.env.CLUSTER_PASSWORD+'@cluster0.pz95adm.mongodb.net/miniProject')
.catch((err) => {
    if (err) throw err;
})
.then(() => {
    console.log('database connected')
})
autoIncrement.initialize(mongoose.connection)
const productSchema = new mongoose.Schema({
	product: {
		type: String,
	},
	name: {
		type: String,
		required: true
	},
	owner: {
		type: String,
		required: true
	},
	buyer: {
		type: String,
		required: true,
		default: 'null',
	},
	price: {
		type: Number,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	time: {
		type: Number,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	isPending: {
		type: Boolean,
		default: false,
	},
	isToken: {
		type: Boolean,
		required: true,
	},
})

const offerSchema = new mongoose.Schema({
	offer: {
		type: String
	},
	product: {
		type: Number,
		required: true
	},
	offerAmount: {
		type: Number,
		required: true,
	},
	offerMaker: {
		type: String,
		required: true
	},
	isAccepted: {
		type: Boolean,
		default: false,
	},
	isBought: {
		type: Boolean,
		default: false,
	},
	time: {
		type: Number,
		required: true
	}
})

productSchema.plugin(autoIncrement.plugin, { model: 'products', field: 'product', startAt: 101 });
offerSchema.plugin(autoIncrement.plugin, { model: 'offers', field: 'offer', startAt: 101 });

const Products = new mongoose.model('products', productSchema);
const Offers = new mongoose.model('offers', offerSchema);

module.exports = { Products, Offers };