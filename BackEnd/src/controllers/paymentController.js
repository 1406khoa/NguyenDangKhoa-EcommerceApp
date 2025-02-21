// controllers/paymentController.js
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");

/**
 * Tạo một payment mới dựa trên giỏ hàng hiện tại của user
 */
const createPayment = async (req, res) => {
  try {
    const { userId, paymentMethod } = req.body;

    // Lấy giỏ hàng của user
    const userCart = await Cart.findOne({ userId }).populate("items.productId");
    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Tạo Payment mới từ thông tin giỏ hàng
    const newPayment = new Payment({
      userId,
      items: userCart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: userCart.totalPrice,
      paymentMethod,
    });

    await newPayment.save();

    // Tuỳ chọn: Sau khi tạo payment xong có thể xóa giỏ hoặc giữ lại
    // userCart.items = [];
    // userCart.totalPrice = 0;
    // await userCart.save();

    return res.status(201).json({ message: "Payment created", payment: newPayment });
  } catch (error) {
    return res.status(500).json({ message: "Error creating payment", error: error.message });
  }
};

/**
 * Lấy thông tin thanh toán theo paymentId (nếu cần hiển thị chi tiết)
 */
const getPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate("items.productId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    return res.json(payment);
  } catch (error) {
    return res.status(500).json({ message: "Error getting payment", error: error.message });
  }
};

/**
 * Cập nhật trạng thái payment (nếu cần) - Ví dụ: pending -> paid
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = status;
    await payment.save();

    return res.json({ message: "Payment status updated", payment });
  } catch (error) {
    return res.status(500).json({ message: "Error updating payment status", error: error.message });
  }
};

module.exports = {
  createPayment,
  getPayment,
  updatePaymentStatus
};
