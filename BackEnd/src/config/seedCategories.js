const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();
const connectDB = require("./db");

connectDB(); // Kết nối database

const seedCategories = async () => {
    try {
        await Category.deleteMany(); // Xóa dữ liệu cũ

        const categories = [
            { name: "Electronics", image: "/images/electronics.jpg" },
            { name: "Clothing", image: "/images/clothing.jpg" },
            { name: "Jacket", image: "/images/jacket.jpg" },
            { name: "Accessories", image: "/images/accessories.jpg" },
            { name: "Home & Living", image: "/images/home.jpg" }
        ];

        await Category.insertMany(categories);
        console.log("✅ Dữ liệu danh mục đã được thêm!");
        process.exit();
    } catch (err) {
        console.error("❌ Lỗi khi thêm danh mục:", err);
        process.exit(1);
    }
};

seedCategories();
