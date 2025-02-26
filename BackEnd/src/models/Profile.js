const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  // Lưu tọa độ (được lấy từ Google Maps API khi cập nhật địa chỉ)
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  avatar: { type: String }, // URL ảnh đại diện
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
