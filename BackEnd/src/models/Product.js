const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: { type: [String], required: true },
});

const Product = mongoose.model('product', productSchema, 'product');

module.exports = Product;
