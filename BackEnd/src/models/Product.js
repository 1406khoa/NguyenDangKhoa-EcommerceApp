const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    images: { type: [String], required: true },
    price: { type: Number, required: true },  // ✅ Thêm giá sản phẩm
    category: { type: String, required: true },  // ✅ Phân loại sản phẩm
    stock: { type: Number, required: true, default: 0 }, // ✅ Quản lý số lượng tồn kho
    description: { type: String },  // ✅ Thêm mô tả chi tiết
    reviews: [
        {
            user: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String }
        }
    ], // ✅ Thêm đánh giá sản phẩm
    createdAt: { type: Date, default: Date.now } // ✅ Thời gian tạo
});

const Product = mongoose.model("product", productSchema, "product");

module.exports = Product;
