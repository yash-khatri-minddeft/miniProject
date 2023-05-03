const { mongoose } = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
	product: {
		type: Number,
		unique: true,
		required: true
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
		type: Number,
		unique: true,
		required: true,
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

const Products = new mongoose.model('products', productSchema);
const Offers = new mongoose.model('offers', offerSchema);

module.exports = { Products, Offers };