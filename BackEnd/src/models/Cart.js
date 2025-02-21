const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // ID của user
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, default: 0 }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
