const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Tìm sản phẩm trong database
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Nếu chưa có giỏ hàng, tạo mới
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa
        const existingItem = cart.items.find(item => item.productId.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: product.price });
        }

        // Cập nhật tổng giá
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            model: "product" // ✅ Phải khớp với tên model trong `Product.js`
        });

        if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy giỏ hàng", error: error.message });
    }
};


const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        // ✅ Tìm index của sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" });
        }

        // ✅ Nếu chỉ còn 1 sản phẩm, xóa luôn cả giỏ hàng
        if (cart.items.length === 1) {
            await Cart.findOneAndDelete({ userId });
            return res.json({ message: "Đã xóa sản phẩm cuối cùng. Giỏ hàng trống!" });
        }

        // ✅ Nếu còn nhiều sản phẩm, chỉ xóa sản phẩm đó và cập nhật lại giỏ hàng
        const removedItem = cart.items.splice(itemIndex, 1)[0]; // Xóa sản phẩm khỏi mảng
        cart.totalPrice -= removedItem.price * removedItem.quantity; // Cập nhật giá tổng

        await cart.save(); // Lưu thay đổi vào DB

        return res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart });

    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
};



module.exports = { addToCart, getCart, removeFromCart };
