const Product = require("../models/Product");

// Lấy danh sách sản phẩm
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => ({ uri: img })), // Convert thành object { uri: "..." }
        }));
        res.json(formattedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts };
