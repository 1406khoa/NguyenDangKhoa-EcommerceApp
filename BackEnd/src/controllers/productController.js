const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const products = await Product.find(filter);
        const formattedProducts = products.map(product => ({
            ...product._doc,
            images: product.images.map(img => ({ uri: img })),
        }));
        res.json(formattedProducts);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
    }
};


// ✅ Lấy chi tiết 1 sản phẩm theo ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json({ ...product._doc, images: product.images.map(img => ({ uri: img })) });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: err.message });
    }
};

// ✅ Thêm sản phẩm mới
const createProduct = async (req, res) => {
    try {
        const { name, images, price, category, stock, description } = req.body;
        const newProduct = new Product({ name, images, price, category, stock, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error: err.message });
    }
};

// ✅ Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: err.message });
    }
};

// ✅ Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json({ message: "Sản phẩm đã bị xóa" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: err.message });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
