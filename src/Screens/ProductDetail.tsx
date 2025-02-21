import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/RootNavigator";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";

type Props = StackScreenProps<RootStackParams, "ProductDetail">;

const ProductDetail = ({ route, navigation }: Props) => {

  const userId = "user123"; // Giả lập userId, có thể lấy từ context hoặc storage
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:5000/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.error(error));
  }, [productId]);

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/cart/add", {
        userId,
        productId: product._id, // ID sản phẩm
        quantity: 1, // Số lượng mặc định là 1
      });

      if (response.status === 200) {
        console.log("Response full data:", response.data);
        console.log("Cart items:", response.data.items);
        if (response.data.items) {
          response.data.items.forEach((item: any, index: any) => {
            console.log(`Item ${index}:`, item);
          });
        }

        alert("Đã thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra!");
    }
  };


  return (
    <ScrollView style={styles.container}>

      {/* Ảnh sản phẩm */}

      <Image source={{ uri: `http://10.0.2.2:5000${product.images[0].uri}` }} style={styles.image} />


      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        {/* Nút mua hàng */}
        <TouchableOpacity style={styles.buyButton} onPress={handleAddToCart}>
          <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 50,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 20,
    color: "#009688",
    marginVertical: 10,
  },
  productDescription: {
    fontSize: 16,
    color: "#666",
  },
  buyButton: {
    marginTop: 20,
    backgroundColor: "blue",
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  buyButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
