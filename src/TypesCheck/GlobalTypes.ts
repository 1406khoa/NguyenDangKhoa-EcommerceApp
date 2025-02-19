// ✅ Định nghĩa kiểu danh mục
export type Category = {
    _id: string;
    name: string;
    image: string;
  };
  
  // ✅ Định nghĩa kiểu sản phẩm
  export type Product = {
    _id: string;
    name: string;
    images: { uri: string }[];
    price: number;
    category: string;
  };
  