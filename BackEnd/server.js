// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// const multer = require('multer');
// const path = require('path');

// app.use('/images', express.static(path.join(__dirname, 'public/images')));

// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB Atlas with EcommerceDB
// const mongoURI = 'mongodb+srv://khoa:22111530@clustertest.accfq.mongodb.net/EcommerceDB';

// mongoose.connect(mongoURI)
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Define Product schema
// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     images: { type: [String], required: true }
// });

// const Product = mongoose.model('product', productSchema, 'product');


// // Cấu hình multer để lưu ảnh vào `public/images`
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'public/images'),
//     filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
// });
// const upload = multer({ storage });

// // API upload ảnh
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     const imageUrl = `/images/${req.file.filename}`;
//     res.json({ imageUrl });
// });

// // API to get all products
// app.get('/api/products', async (req, res) => {
//     try {
//         const products = await Product.find();
//         const formattedProducts = products.map(product => ({
//             ...product._doc,
//             images: product.images.map(img => ({ uri: img })) // Convert strings to objects with 'uri'
//         }));
//         res.json(formattedProducts);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


require("dotenv").config();
const http = require("http");
const connectDB = require("./src/config/db");
const app = require("./src/app");

// Kết nối MongoDB
connectDB();

// Cấu hình cổng chạy server
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Lắng nghe server chạy
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
