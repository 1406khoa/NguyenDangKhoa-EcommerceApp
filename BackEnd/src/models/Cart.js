const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId, ref: "Variant" }, // Trường mới
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, default: 0 },
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
