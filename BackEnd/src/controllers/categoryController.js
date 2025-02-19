const Category = require("../models/Category");

// ✅ Lấy danh sách danh mục
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh mục", error: err.message });
    }
};

// ✅ Thêm danh mục mới
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        const newCategory = new Category({ name, image });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tạo danh mục", error: err.message });
    }
};

module.exports = { getAllCategories, createCategory };
