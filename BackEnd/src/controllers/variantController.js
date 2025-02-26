// controllers/variantController.js
const Variant = require("../models/Variant");

// Tạo một biến thể cho sản phẩm
const createVariant = async (req, res) => {
  try {
    const { productId, attributes, stock, price, images } = req.body;
    const newVariant = new Variant({ productId, attributes, stock, price, images });
    await newVariant.save();
    res.status(201).json(newVariant);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo variant", error: error.message });
  }
};

// Lấy danh sách biến thể của một sản phẩm
const getVariants = async (req, res) => {
  try {
    const { productId } = req.query;
    const variants = await Variant.find({ productId });
    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy variants", error: error.message });
  }
};

module.exports = { createVariant, getVariants };
