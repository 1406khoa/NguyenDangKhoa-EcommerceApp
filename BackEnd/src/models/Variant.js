const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    attributes: [{ name: String, value: String }],
    stock: { type: Number, required: true, default: 0 },
    price: { type: Number },
    images: { type: [String] },
});

// Thêm index để tối ưu truy vấn theo productId và các thuộc tính
variantSchema.index({ productId: 1, "attributes.name": 1, "attributes.value": 1 });

const Variant = mongoose.model("Variant", variantSchema);
module.exports = Variant;
