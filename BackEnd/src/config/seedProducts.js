const axios = require("axios");

const products = [
    // Electronics
    {
        name: "Samsung Galaxy S23 Ultra",
        images: ["/images/samsung-s23-ultra.jpg"],
        price: 1399,
        category: "Electronics",
        stock: 8,
        description: "Samsung Galaxy S23 Ultra với màn hình 120Hz, camera 200MP, chip Snapdragon 8 Gen 2."
    },
    {
        name: "MacBook Pro M2",
        images: ["/images/macbook-pro-m2.jpg"],
        price: 1999,
        category: "Electronics",
        stock: 10,
        description: "MacBook Pro M2 với màn hình Retina 13-inch, chip Apple M2, pin 20 giờ."
    },
    {
        name: "Bose SoundLink Revolve+",
        images: ["/images/bose-speaker.jpg"],
        price: 299,
        category: "Electronics",
        stock: 10,
        description: "Loa Bluetooth Bose SoundLink Revolve+, âm thanh 360 độ, pin 17 giờ."
    },
    {
        name: "Laptop Dell XPS 13",
        images: ["/images/laptop-dell.jpg"],
        price: 1299,
        category: "Electronics",
        stock: 10,
        description: "Laptop Dell XPS 13 với chip Intel Core i7 thế hệ 12, RAM 16GB, SSD 512GB."
    },
    {
        name: "Sony WH-1000XM5",
        images: ["/images/sony-headphone.jpg"],
        price: 399,
        category: "Electronics",
        stock: 15,
        description: "Tai nghe chống ồn Sony WH-1000XM5, pin 30h, kết nối Bluetooth 5.2."
    },
    {
        name: "Samsung 55-inch QLED TV",
        images: ["/images/samsung-tv.jpg"],
        price: 899,
        category: "Electronics",
        stock: 12,
        description: "Smart TV Samsung 55 inch, công nghệ QLED, 4K UHD, hỗ trợ HDR10+."
    },

    // Jacket
    {
        name: "Áo Khoác Bomber",
        images: ["/images/jacket-bomber.jpg"],
        price: 55,
        category: "Jacket",
        stock: 10,
        description: "Áo khoác bomber phong cách Hàn Quốc, chất liệu cotton cao cấp."
    },
    {
        name: "Áo Khoác Da Nam",
        images: ["/images/jacket-leather.jpg"],
        price: 120,
        category: "Jacket",
        stock: 8,
        description: "Áo khoác da thật, chống nước, giữ ấm tốt."
    },
    {
        name: "Áo Hoodie Unisex",
        images: ["/images/jacket-hoodie.jpg"],
        price: 45,
        category: "Jacket",
        stock: 15,
        description: "Áo hoodie freesize cho cả nam và nữ, chất liệu nỉ bông dày dặn."
    },

    // Clothing
    {
        name: "Áo Hoodie Nam",
        images: ["/images/hoodie.jpg"],
        price: 35,
        category: "Clothing",
        stock: 10,
        description: "Áo hoodie nam phong cách Hàn Quốc, chất liệu cotton mềm mại."
    },
    {
        name: "Quần Jean Skinny",
        images: ["/images/jean-skinny.jpg"],
        price: 50,
        category: "Clothing",
        stock: 15,
        description: "Quần jean skinny dành cho nam, kiểu dáng ôm sát, phong cách trẻ trung."
    },
    {
        name: "Áo Thun Unisex",
        images: ["/images/tshirt.jpg"],
        price: 20,
        category: "Clothing",
        stock: 20,
        description: "Áo thun Unisex vải cotton 100%, phù hợp với cả nam và nữ."
    },

    // Accessories
    {
        name: "Túi Xách Gucci",
        images: ["/images/gucci-bag.jpg"],
        price: 1200,
        category: "Accessories",
        stock: 4,
        description: "Túi xách Gucci chính hãng, phong cách sang trọng, chất liệu da cao cấp."
    },
    {
        name: "Kính Râm Ray-Ban",
        images: ["/images/rayban.jpg"],
        price: 150,
        category: "Accessories",
        stock: 5,
        description: "Kính râm Ray-Ban phong cách cổ điển, phù hợp đi chơi và du lịch."
    },
    {
        name: "Apple Watch Series 8",
        images: ["/images/apple-watch.jpg"],
        price: 399,
        category: "Accessories",
        stock: 5,
        description: "Đồng hồ thông minh Apple Watch Series 8 với màn hình Always-On."
    },
    {
        name: "Balo Laptop",
        images: ["/images/laptop-backpack.jpg"],
        price: 60,
        category: "Accessories",
        stock: 8,
        description: "Balo laptop chống nước, phù hợp với laptop 15 inch, nhiều ngăn tiện lợi."
    },

    // Home
    {
        name: "Ghế Gaming Razer Iskur",
        images: ["/images/razer-iskur.jpg"],
        price: 499,
        category: "Home",
        stock: 7,
        description: "Ghế gaming Razer Iskur với đệm lưng công thái học, chất liệu cao cấp."
    },
    {
        name: "Bộ Dụng Cụ Nhà Bếp 6 Món",
        images: ["/images/home-kitchen-set.jpg"],
        price: 50,
        category: "Home",
        stock: 10,
        description: "Bộ dụng cụ nấu ăn gồm chảo, nồi, thìa gỗ và dụng cụ nhà bếp tiện lợi."
    },
    {
        name: "Bộ Ga Gối Cotton",
        images: ["/images/home-bedding.jpg"],
        price: 35,
        category: "Home",
        stock: 20,
        description: "Bộ ga gối cotton mềm mại, thoáng khí, phù hợp với mọi loại giường."
    },
    {
        name: "Đèn Ngủ LED Cảm Ứng",
        images: ["/images/home-ledlamp.jpg"],
        price: 25,
        category: "Home",
        stock: 30,
        description: "Đèn ngủ cảm ứng, tiết kiệm điện, ánh sáng dịu nhẹ giúp ngủ ngon hơn."
    }
];

const categoryVariants = {
    Electronics: [
        { name: "RAM", values: ["8GB", "16GB", "32GB"] },
        { name: "Storage", values: ["256GB", "512GB", "1TB"] },
        { name: "Color", values: ["Black", "Silver", "Blue"] }
    ],
    Jacket: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Black", "Navy", "Gray"] }
    ],
    Clothing: [
        { name: "Size", values: ["S", "M", "L", "XL"] },
        { name: "Color", values: ["Blue", "Black", "White", "Red"] }
    ],
    Accessories: [
        { name: "Material", values: ["Metal", "Leather", "Plastic"] },
        { name: "Color", values: ["Gold", "Silver", "Black"] }
    ],
    Home: [
        { name: "Material", values: ["Wood", "Plastic", "Glass"] },
        { name: "Color", values: ["White", "Brown", "Black"] }
    ]
};

// Hàm lấy ngẫu nhiên thuộc tính từ danh mục phù hợp
const getRandomAttributes = (category) => {
    const attributes = categoryVariants[category];
    if (!attributes) return [];

    // Chọn ngẫu nhiên 2 thuộc tính phù hợp
    const selectedAttributes = attributes
        .map(attr => ({
            name: attr.name,
            value: attr.values[Math.floor(Math.random() * attr.values.length)]
        }))
        .slice(0, 2);

    return selectedAttributes;
};

// Thêm sản phẩm vào database
const addProducts = async () => {
    for (const product of products) {
        try {
            const res = await axios.post("http://localhost:5000/api/products", product);
            console.log(`✅ Đã thêm sản phẩm: ${product.name}`);

            const productId = res.data._id;

            // Thêm 2-3 biến thể hợp lý cho sản phẩm này
            const variantCount = 2 + Math.floor(Math.random() * 2); // 2 hoặc 3 biến thể
            for (let i = 0; i < variantCount; i++) {
                const attributes = getRandomAttributes(product.category);
                const variant = {
                    productId,
                    attributes,
                    stock: 5 + Math.floor(Math.random() * 10),
                    price: product.price + Math.floor(Math.random() * 100),
                    images: [ product.images[0] ] // product.images[0] là chuỗi, nên giữ nguyên
                };

                await axios.post("http://localhost:5000/api/variants", variant);
                console.log(`   🔹 Đã thêm biến thể ${i + 1} cho sản phẩm ${product.name}`);
            }
        } catch (error) {
            console.error(`❌ Lỗi khi thêm sản phẩm ${product.name}:`, {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                stack: error.stack
            });
            
        }
    }
};

// Chạy script
addProducts();
