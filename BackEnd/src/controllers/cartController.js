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
            // Nếu chưa có giỏ hàng, tạo mới và lưu ngay
            cart = new Cart({ userId, items: [], totalPrice: 0 });
            await cart.save();
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItem = cart.items.find(item => item.productId.equals(productId));

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

        let cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        // Xóa sản phẩm khỏi giỏ hàng
        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);

        // Cập nhật tổng tiền
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        if (cart.items.length === 0) {
            cart.totalPrice = 0;
        }

        await cart.save();

        // Populate lại để đảm bảo dữ liệu trả về đầy đủ
        const updatedCart = await Cart.findOne({ userId }).populate("items.productId");

        res.json({ message: "Đã xóa sản phẩm", cart: updatedCart });

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
};

const updateCartByQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
        }

        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
        }

        if (quantity <= 0) {
            // Nếu số lượng = 0, xóa sản phẩm khỏi giỏ hàng
            cart.items.splice(itemIndex, 1);
        } else {
            // Cập nhật số lượng sản phẩm
            cart.items[itemIndex].quantity = quantity;
        }

        // Cập nhật tổng tiền
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();

        res.json({ message: "Đã cập nhật giỏ hàng", cart });

    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng", error: error.message });
    }
};





module.exports = { addToCart, getCart, removeFromCart, updateCartByQuantity };
