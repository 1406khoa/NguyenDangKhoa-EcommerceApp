const Category = require("../models/Category");
const Product = require("../models/Product");

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

const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // ✅ Kiểm tra xem danh mục có tồn tại không
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        // ✅ Kiểm tra xem có sản phẩm nào thuộc danh mục này không
        const productsInCategory = await Product.find({ category: category.name });
        if (productsInCategory.length > 0) {
            return res.status(400).json({ 
                message: "Không thể xóa danh mục vì có sản phẩm thuộc danh mục này"
            });
        }

        // ✅ Xóa danh mục
        await Category.findByIdAndDelete(categoryId);

        res.json({ message: "Danh mục đã được xóa thành công" });

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa danh mục", error: error.message });
    }
};

module.exports = { getAllCategories, createCategory, deleteCategory };
