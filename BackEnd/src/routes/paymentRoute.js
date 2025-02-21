// routes/paymentRoute.js
const express = require("express");
const {
  createPayment,
  getPayment,
  updatePaymentStatus,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/", createPayment);           // POST /api/payment
router.get("/:paymentId", getPayment);     // GET  /api/payment/:paymentId
router.put("/:paymentId", updatePaymentStatus); // PUT /api/payment/:paymentId

module.exports = router;
