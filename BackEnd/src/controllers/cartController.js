const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Variant = require("../models/Variant");

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId, productId, variantId, quantity } = req.body;

        // Tìm sản phẩm
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        let price = product.price;
        if (variantId) {
            const variant = await Variant.findById(variantId);
            if (!variant) return res.status(404).json({ message: "Biến thể không tồn tại" });
            if (variant.stock < quantity) {
                return res.status(400).json({ message: "Sản phẩm đã hết hàng" });
            }
            price = variant.price || product.price;
        }

        // Tìm giỏ hàng của người dùng
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
            await cart.save();
        }

        // Kiểm tra xem sản phẩm + biến thể có trong giỏ hàng chưa
        const existingItem = cart.items.find((item) => {
            return (
                item.productId.equals(productId) &&
                ((variantId && item.variantId && item.variantId.equals(variantId)) || (!variantId && !item.variantId))
            );
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, variantId: variantId || undefined, quantity, price });
        }

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
        let cart = await Cart.findOne({ userId }).populate({
            path: "items.productId",
            model: "product"
        });

        // Nếu không có cart, trả về giỏ hàng trống
        if (!cart) {
            return res.status(200).json({ items: [], totalPrice: 0 });
        }

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
