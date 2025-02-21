// PaymentScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  ScrollView
} from "react-native";
import axios from "axios";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = TabsStackScreenProps<"Payment">;

const PaymentScreen = ({ navigation }: Props) => {
  const userId = "user123";
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");

  // Fetch giỏ hàng khi màn hình được load
  useEffect(() => {
    axios
      .get(`http://10.0.2.2:5000/api/cart/${userId}`)
      .then((response) => {
        setCart(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setLoading(false);
      });
  });

  const handlePayment = async () => {
    // Nếu chọn thẻ tín dụng, kiểm tra thông tin nhập vào
    if (paymentMethod === "credit_card") {
      if (!cardNumber || !expiry || !cvv) {
        alert("Vui lòng nhập đầy đủ thông tin thẻ tín dụng");
        return;
      }
    }
    try {
      const response = await axios.post("http://10.0.2.2:5000/api/payment", {
        userId,
        paymentMethod,
        // Nếu cần gửi thông tin thẻ, có thể bao gồm trong body
        cardInfo:
          paymentMethod === "credit_card"
            ? { cardNumber, expiry, cvv }
            : undefined,
      });

      if (response.status === 201) {
        alert("Thanh toán thành công!");
        // Điều hướng về TabsStack hoặc màn hình khác sau khi thanh toán thành công
        navigation.navigate("TabsStack");
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
        keyExtractor={(item) => item._id} // Đảm bảo mỗi item có key duy nhất
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
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
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
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryContainer: {
    marginVertical: 10,
    alignItems: "flex-end",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  paymentOptions: {
    marginVertical: 20,
  },
  paymentOption: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedOption: {
    borderColor: "blue",
  },
  optionText: {
    fontSize: 16,
  },
  cardForm: {
    marginBottom: 20,
  },
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
  paymentButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
