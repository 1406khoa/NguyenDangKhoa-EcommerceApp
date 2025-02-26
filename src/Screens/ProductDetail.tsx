import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/RootNavigator";
import { Dimensions } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = StackScreenProps<RootStackParams, "ProductDetail">;

type AttributeOption = {
  name: string;
  values: string[];
};
const screenWidth = Dimensions.get("window").width;

const ProductDetail = ({ route, navigation }: Props) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [attributeOptions, setAttributeOptions] = useState<AttributeOption[]>([]);

  const [cartLength, setCartLength] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Lấy biến thể từ API riêng (với images là mảng chuỗi)
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:5000/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        if (response.data.variants && response.data.variants.length > 0) {
          // Tách ra các nhóm thuộc tính dựa trên các variants
          const options: Record<string, Set<string>> = {};
          response.data.variants.forEach((variant: any) => {
            variant.attributes.forEach((attr: any) => {
              if (!options[attr.name]) {
                options[attr.name] = new Set();
              }
              options[attr.name].add(attr.value);
            });
          });
          const opts: AttributeOption[] = Object.keys(options).map((key) => ({
            name: key,
            values: Array.from(options[key]),
          }));
          setAttributeOptions(opts);
        }
      })
      .catch((error) => console.error(error));

    axios
      .get(`http://10.0.2.2:5000/api/variants?productId=${productId}`)
      .then((response) => setVariants(response.data))
      .catch((error) => console.error(error));
  }, [productId]);

  // Mỗi khi lựa chọn thuộc tính thay đổi, xác định biến thể tương ứng
  useEffect(() => {
    if (product && product.variants) {
      const matched = product.variants.find((variant: any) => {
        return variant.attributes.every((attr: any) => {
          return selectedAttributes[attr.name] === attr.value;
        });
      });
      setSelectedVariant(matched || null);
    }
  }, [selectedAttributes, product]);

  const handleSelectAttribute = (name: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [name]: prev[name] === value ? "" : value, // Toggle nếu đã chọn
    }));
  };

  const handleAddToCart = async () => {
    try {
      // Lấy userId từ AsyncStorage
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
        navigation.navigate("Login");
        return;
      }
      const user = JSON.parse(userStr);
  
      // Gửi request thêm vào giỏ hàng
      const payload = {
        userId: user._id,      // ✅ Lấy _id thực sự của user
        productId: product._id,
        quantity: 1,
      };
  
      const response = await axios.post("http://10.0.2.2:5000/api/cart/add", payload);
      if (response.status === 200) {
        alert("Đã thêm vào giỏ hàng!");
        fetchCartLength();
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const fetchCartLength = () => {
    axios
      .get(`http://10.0.2.2:5000/api/cart/${userId}`)
      .then((response) => {
        const items = response.data?.items ?? [];
        setCartLength(items.length);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi lấy số lượng giỏ hàng:", error);
        setCartLength(0);
      });
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ✅ Tổng hợp tất cả hình ảnh từ sản phẩm chính và biến thể từ API riêng
  const allImages = [
    // Hình ảnh sản phẩm chính (product.images đã được trả về dạng { uri: string })
    ...product.images.map((img: { uri: string }) => `http://10.0.2.2:5000${img.uri}`),

    // Hình ảnh từ biến thể (variants API trả về images là mảng chuỗi)
    ...variants.flatMap((variant: any) =>
      (Array.isArray(variant.images) ? variant.images : []).map((img: string) => `http://10.0.2.2:5000${img}`)
    ),
  ];

  // ✅ Log để kiểm tra
  console.log("📸 Tất cả ảnh tổng hợp:", allImages);

  return (
    <ScrollView style={styles.container}>
      {/* Ảnh sản phẩm */}
      <FlatList
        data={allImages}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
      />


      {/* Thông tin sản phẩm */}
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${selectedVariant?.price || product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        {attributeOptions.length > 0 && (
          <View style={styles.attributesContainer}>
            {attributeOptions.map((option) => (
              <View key={option.name} style={styles.attributeGroup}>
                <Text style={styles.attributeTitle}>{option.name}</Text>

                {/* ✅ Cuộn ngang các “chip” giá trị của attribute */}
                <ScrollView
                  horizontal
                  style={styles.attributeScroll}
                  showsHorizontalScrollIndicator={false}
                >
                  {option.values.map((value) => {
                    const isSelected = selectedAttributes[option.name] === value;

                    // Kiểm tra xem option này có khả dụng (dựa trên tồn kho)
                    const available = product.variants.some((variant: any) => {
                      if (variant.attributes.find((attr: any) => attr.name === option.name && attr.value === value)) {
                        return (
                          Object.keys(selectedAttributes).every((attrName) => {
                            // Bỏ qua attribute hiện tại hoặc chưa chọn
                            if (attrName === option.name || !selectedAttributes[attrName]) return true;
                            return variant.attributes.some(
                              (attr: any) => attr.name === attrName && attr.value === selectedAttributes[attrName]
                            );
                          }) && variant.stock > 0
                        );
                      }
                      return false;
                    });

                    return (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.chip,
                          isSelected && styles.chipSelected,
                          !available && styles.chipDisabled,
                        ]}
                        disabled={!available}
                        onPress={() => handleSelectAttribute(option.name, value)}
                      >
                        <Text style={styles.chipText}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            ))}
          </View>
        )}


        {selectedVariant && (
          <Text style={styles.stockText}>
            {selectedVariant.stock > 0 ? `Còn hàng (${selectedVariant.stock})` : "Hết hàng"}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.buyButton, (!selectedVariant || selectedVariant.stock <= 0) && styles.buyButtonDisabled]}
          onPress={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.stock <= 0}
        >
          <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  imageContainer: {
    width: screenWidth,       // Mỗi element chiếm full chiều rộng màn hình
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: screenWidth * 0.9, // 90% chiều rộng màn hình, tạo lề xung quanh
    height: 300,
    resizeMode: "cover",
    borderRadius: 10,
  },
  container:
  {
    flex: 1, backgroundColor: "white"
  },
  loadingContainer:
  {
    flex: 1, justifyContent: "center", alignItems: "center"
  },
  loadingText: {
    fontSize: 18, color: "#666"
  },
  infoContainer:
  {
    padding: 20

  },
  productName: {
    fontSize: 24, fontWeight: "bold", color: "#333"
  },
  productPrice: {
    fontSize: 20, color: "#009688", marginVertical: 10
  },
  productDescription: {
    fontSize: 16, color: "#666"
  },
  attributeValues: {
    flexDirection: "row", flexWrap: "wrap"
  },
  attributeButton: {
    padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginRight: 10, marginBottom: 10
  },
  attributeButtonSelected: {
    borderColor: "blue", backgroundColor: "#e0f0ff"
  },
  attributeButtonDisabled: {
    borderColor: "#eee", backgroundColor: "#f5f5f5"

  },
  attributeButtonText: {
    fontSize: 14
  },
  stockText: {
    marginVertical: 10, fontSize: 16, color: "#333"

  },
  buyButton: {
    marginTop: 20, backgroundColor: "blue", paddingVertical: 12, borderRadius: 5, alignItems: "center"
  },
  buyButtonDisabled: {
    backgroundColor: "gray"
  },
  buyButtonText: {
    fontSize: 18, fontWeight: "bold", color: "white"
  },
  attributesContainer: {
    marginVertical: 15,
  },
  attributeGroup: {
    marginBottom: 20, // Tạo khoảng cách giữa các nhóm
  },
  attributeTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  attributeScroll: {
    // Tùy chọn: có thể thêm margin hoặc padding
  },

  // ✅ Chip styles
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    // Tạo bóng nhẹ (tùy ý)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chipSelected: {
    backgroundColor: "#007AFF", // Màu xanh dương khi được chọn
  },
  chipDisabled: {
    backgroundColor: "#ddd", // Màu xám khi không khả dụng
  },
  chipText: {
    color: "#333",
    fontSize: 14,
  },
});
