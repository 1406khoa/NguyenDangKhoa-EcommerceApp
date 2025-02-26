import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
} from "react-native";
import axios from "axios";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = TabsStackScreenProps<"Payment">;

const PaymentScreen = ({ navigation, route }: Props) => {
  // Nếu bạn truyền totalPrice từ Cart, có thể nhận qua route.params
  // const { totalPrice } = route.params;

  const [userId, setUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  // Lấy userId từ AsyncStorage khi mở màn hình Payment
  const fetchUserId = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        // Chưa đăng nhập
        alert("Vui lòng đăng nhập để thanh toán");
        navigation.navigate("Login");
        return;
      }
      const user = JSON.parse(userStr);
      setUserId(user._id);
    } catch (error) {
      console.error("❌ Lỗi khi lấy user:", error);
    }
  };

  // Fetch giỏ hàng
  const fetchCart = async (uId: string) => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/api/cart/${uId}`);
      setCart(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUserId();
    })();
  }, []);

  // Mỗi khi userId thay đổi => fetch giỏ hàng
  useEffect(() => {
    if (userId) {
      fetchCart(userId);
    }
  });

  const handlePayment = async () => {
    // Nếu chọn thẻ tín dụng, kiểm tra thông tin
    if (paymentMethod === "credit_card") {
      if (!cardNumber || !expiry || !cvv) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ tín dụng");
        return;
      }
    }

    try {
      // Kiểm tra userId
      if (!userId) {
        alert("Vui lòng đăng nhập để thanh toán");
        navigation.navigate("Login");
        return;
      }

      // Gửi request thanh toán
      const response = await axios.post("http://10.0.2.2:5000/api/payment", {
        userId,
        paymentMethod,
        cardInfo:
          paymentMethod === "credit_card"
            ? { cardNumber, expiry, cvv }
            : undefined,
      });

      if (response.status === 201) {
        alert("Thanh toán thành công!");
        // Có thể điều hướng về Home hoặc TabsStack
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán!");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Giỏ hàng trống</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Hiển thị danh sách sản phẩm trong giỏ hàng */}
      <Text style={styles.header}>Giỏ hàng của bạn</Text>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: `http://10.0.2.2:5000${item.productId.images[0]}` }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.productId.name}</Text>
              <Text>Số lượng: {item.quantity}</Text>
              <Text>Giá: ${item.price}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.totalText}>Tổng tiền: ${cart.totalPrice}</Text>
      </View>

      {/* Phần chọn phương thức thanh toán */}
      <Text style={styles.header}>Phương thức thanh toán</Text>
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          onPress={() => setPaymentMethod("cod")}
          style={[
            styles.paymentOption,
            paymentMethod === "cod" && styles.selectedOption,
          ]}
        >
          <Text style={styles.optionText}>Thanh toán khi nhận hàng (COD)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("paypal")}
          style={[
            styles.paymentOption,
            paymentMethod === "paypal" && styles.selectedOption,
          ]}
        >
          <Text style={styles.optionText}>PayPal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setPaymentMethod("credit_card")}
          style={[
            styles.paymentOption,
            paymentMethod === "credit_card" && styles.selectedOption,
          ]}
        >
          <Text style={styles.optionText}>Thẻ tín dụng</Text>
        </TouchableOpacity>
      </View>

      {/* Nếu chọn thẻ tín dụng, hiển thị form nhập thông tin */}
      {paymentMethod === "credit_card" && (
        <View style={styles.cardForm}>
          <TextInput
            style={styles.input}
            placeholder="Số thẻ"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Hạn sử dụng (MM/YY)"
            value={expiry}
            onChangeText={setExpiry}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      )}

      <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
        <Text style={styles.paymentButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginVertical: 10 },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  summaryContainer: { marginVertical: 10, alignItems: "flex-end" },
  totalText: { fontSize: 18, fontWeight: "bold" },
  paymentOptions: { marginVertical: 20 },
  paymentOption: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: { borderColor: "blue" },
  optionText: { fontSize: 16 },
  cardForm: { marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  paymentButton: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  paymentButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
