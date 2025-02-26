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
  description: string;
  price: number;
  images: { uri: string }[];
  variants: Variant[];
  customOptions: { name: string }[];
}

export type Variant = {
  _id: string;
  attributes: { name: string; value: string }[];
  stock: number;
  price?: number;
  images?: { uri: string }[];
}

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
};