// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "product", 
        required: true 
      },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "cod" }, // ví dụ: 'cod' | 'paypal' | 'credit_card'
  status: { type: String, default: "pending" },    // pending, paid, canceled,...
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
