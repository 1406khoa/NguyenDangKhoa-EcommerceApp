// controllers/profileController.js
const axios = require("axios");
const Profile = require("../models/Profile");

/**
 * Hàm lấy toạ độ từ địa chỉ, dùng Nominatim (OpenStreetMap)
 * Chỉ dùng public endpoint -> nên tuân thủ Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
 */
const getCoordinatesFromAddress = async (address) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    // Đặt user-agent riêng để Nominatim không chặn request
    const res = await axios.get(url, {
      headers: { "User-Agent": "EcommerceApp/1.0" },
    });
    if (res.data && res.data.length > 0) {
      // Lấy kết quả đầu tiên
      const { lat, lon } = res.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
  } catch (error) {
    console.error("Error in OSM geocoding:", error.message);
    return null;
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: "Hồ sơ không tồn tại" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy hồ sơ", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { phone, address, avatar } = req.body;
    const updateData = { phone, avatar };

    if (address) {
      updateData.address = address;
      const location = await getCoordinatesFromAddress(address);
      if (location) {
        updateData.location = location; // { lat, lng }
      }
    }

    let profile = await Profile.findOne({ userId: req.user.userId });
    if (!profile) {
      // Nếu chưa có, tạo mới
      profile = new Profile({ userId: req.user.userId, ...updateData });
      await profile.save();
    } else {
      // Cập nhật hồ sơ
      profile = await Profile.findOneAndUpdate(
        { userId: req.user.userId },
        updateData,
        { new: true }
      );
    }

    res.json({ message: "Cập nhật hồ sơ thành công", profile });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật hồ sơ", error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
