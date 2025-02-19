const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // Tên danh mục (Electronics, Clothing, Shoes...)
    image: { type: String } // Hình ảnh đại diện cho danh mục (nếu có)
});

const Category = mongoose.model("category", categorySchema, "category");

module.exports = Category;
