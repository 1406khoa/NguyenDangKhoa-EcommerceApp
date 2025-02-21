import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { Modal, TextInput } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";

type Props = TabsStackScreenProps<"Cart">;

// Giả lập userId (lấy từ auth nếu có)
const userId = "user123";

const CartScreen = ({ navigation }: Props) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [newQuantity, setNewQuantity] = useState(1);


  // Hàm lấy giỏ hàng
  const fetchCart = () => {
    axios
      .get(`http://10.0.2.2:5000/api/cart/${userId}`)
      .then((response) => {
        console.log("🛒 Cập nhật giỏ hàng:", response.data);
        setCart({ ...response.data });
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy giỏ hàng:", error);
        setCart({ items: [], totalPrice: 0 }); // Nếu lỗi, set giỏ hàng trống
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart(); // Cập nhật giỏ hàng mỗi khi vào lại trang
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
      </View>
    );
  }

  // Hàm xóa sản phẩm
  const handleRemoveFromCart = async (productId: string) => {
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/cart/remove", {
        userId,
        productId,
      });

      console.log("🗑️ Sản phẩm đã xóa:", response.data);

      // Cập nhật lại giỏ hàng
      setCart({ ...response.data.cart });
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    try {
      if (newQuantity < 0) return; // Không cho phép số lượng nhỏ hơn 0

      const response = await axios.post("http://10.0.2.2:5000/api/cart/update", {
        userId,
        productId,
        quantity: newQuantity,
      });

      console.log("✅ Đã cập nhật số lượng:", response.data);
      setCart({ ...response.data.cart }); // Cập nhật lại giỏ hàng
      setEditModalVisible(false); // Đóng modal sau khi cập nhật
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật số lượng:", error);
    }
  };


  // Hàm render khi vuốt trái để xóa
  const renderRightActions = (productId: string, quantity: number) => (
    <View style={styles.swipeButtons}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedProduct({ _id: productId, quantity });
          setNewQuantity(quantity);
          setEditModalVisible(true);
        }}
      >
        <Text style={styles.editButtonText}>Chỉnh sửa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFromCart(productId)}
      >
        <Text style={styles.deleteButtonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Text style={{ alignSelf: "center", fontSize: 25, fontWeight: 600, marginTop: 10 }}>Giỏ Hàng</Text>
        <FlatList
          data={cart.items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            item.productId && item.productId.images?.length > 0 ? (
              <Swipeable renderRightActions={() => renderRightActions(item.productId._id, item.quantity)}>
                <View style={styles.itemContainer}>
                  <Image
                    source={{ uri: `http://10.0.2.2:5000${item.productId.images[0]}` }}
                    style={styles.image}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{item.productId.name}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    <Text style={styles.quantityText}>Số lượng: {item.quantity}</Text>
                  </View>
                </View>
              </Swipeable>
            ) : null
          )}
        />

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.totalPriceText}>Tổng tiền:</Text>
            <Text style={styles.totalPriceAmount}>${cart?.totalPrice ?? 0}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              if (cart?.totalPrice !== undefined) {
                navigation.navigate("Payment", { totalPrice: cart.totalPrice });
              } else {
                alert("Giỏ hàng trống hoặc chưa tải xong!");
              }
            }}
          >
            <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
          </TouchableOpacity>

        </View>

        <Modal visible={editModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chỉnh sửa số lượng</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={newQuantity.toString()}
                onChangeText={(text) => setNewQuantity(Number(text))}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleUpdateQuantity(selectedProduct?._id, newQuantity)}
                >
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 20,
    color: "#999",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#009688",
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
  },
  swipeButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFA500",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
    borderRadius: 10,
    marginRight: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 10,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#009688",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  footer: {
    padding: 15,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPriceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688",
  },
  checkoutButton: {
    backgroundColor: "#009000",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});


export default CartScreen;
