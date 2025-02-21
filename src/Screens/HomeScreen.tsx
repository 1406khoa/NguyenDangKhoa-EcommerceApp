import { Category, Product } from "../TypesCheck/GlobalTypes"; // ✅ Import types từ `TypesCheck`
import { View, Text, Platform, ScrollView, ImageSourcePropType, TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider";
import CategoryCard from "../Components/HomeScreenComponents/CategoryCard";
import { AntDesign } from "@expo/vector-icons";
import { useRef } from "react";
import { Image } from "react-native";

import Slider from "@react-native-community/slider";
import axios from "axios";

// ✅ Định nghĩa kiểu dữ liệu cho useState để tránh lỗi 'never'
const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const gotoCartScreen = () => {
    navigation.navigate("Cart");
  };

  const [sliderImages, setSliderImages] = useState<ImageSourcePropType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // dùng để lưu danh sách danh mục
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]); // dùng để lưu danh sách sản phẩm của danh mục hiện tại

  const [allProducts, setAllProducts] = useState<Product[]>([]); // dùng để lưu danh sách tất cả sản phẩm

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Giới hạn giá tối đa, có thể điều chỉnh

  const tempPrice = useRef(maxPrice);

  const filteredProducts = allProducts.filter(
    (product) => product.price >= minPrice && product.price <= maxPrice
  );

  // ✅ Lấy danh sách sản phẩm cho ImageSlider (TẤT CẢ sản phẩm)
  useEffect(() => {
    axios
      .get<Product[]>("http://10.0.2.2:5000/api/products")
      .then((response) => {
        setAllProducts(response.data);
        const imagesFromAPI = response.data.flatMap((product) =>
          product.images.map((img) => ({ uri: `http://10.0.2.2:5000${img.uri}` }))
        );
        setSliderImages(imagesFromAPI);
      })
      .catch((error) => console.error(error));
  }, []);

  // ✅ Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get<Category[]>("http://10.0.2.2:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  }, []);



  // ✅ Lấy danh sách sản phẩm cho danh mục hiện tại
  useEffect(() => {
    if (categories.length > 0) {
      axios
        .get<Product[]>(`http://10.0.2.2:5000/api/products?category=${categories[currentIndex]?.name}`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((error) => console.error(error));
    }
  }, [currentIndex, categories]);


  // ✅ Chuyển danh mục kế tiếp
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
  };

  // ✅ Chuyển danh mục trước đó
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 0 }}>
      <HeadersComponent gotoCartScreen={gotoCartScreen} allProducts={allProducts} />

      {/* ✅ Image Slider hiển thị tất cả sản phẩm */}
      <View>
        <ImageSlider images={sliderImages} />
      </View>

      <Text style={{ fontSize: 20, fontWeight: "600", marginLeft: 25 }}>Category</Text>

      {/* ✅ Container chứa nút chuyển danh mục và danh mục hiện tại */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
        {/* Nút chuyển danh mục bên trái */}
        <TouchableOpacity onPress={handlePrev} style={{ padding: 10 }}>
          <AntDesign name="leftcircle" size={40} color="black" />
        </TouchableOpacity>

        {/* Hiển thị danh mục hiện tại */}
        {categories.length > 0 && (
          <CategoryCard
            image={{ uri: `http://10.0.2.2:5000${categories[currentIndex]?.image}` }} // ✅ Hiển thị ảnh từ API
            title={categories[currentIndex]?.name}
            onPress={() =>
              navigation.navigate("CategoryScreen", {
                categoryId: categories[currentIndex]?._id,
                categoryName: categories[currentIndex]?.name,
                products: products, // ✅ Truyền danh sách sản phẩm
              })
            }
          />
        )}

        {/* Nút chuyển danh mục bên phải */}
        <TouchableOpacity onPress={handleNext} style={{ padding: 10 }}>
          <AntDesign name="rightcircle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Lọc theo giá</Text>

        <Text>Giá từ: ${minPrice} - ${maxPrice}</Text>

        <Slider
          minimumValue={0}
          maximumValue={2000}
          step={50}
          value={tempPrice.current} // Dùng giá trị tạm thời
          onValueChange={(value) => {
            tempPrice.current = value; // Cập nhật giá trị tạm thời (tránh re-render)
          }}
          onSlidingComplete={(value) => {
            setMaxPrice(value); // Chỉ cập nhật state khi thả tay
          }}
        />

        <Text>Sản phẩm hiển thị: {filteredProducts.length}</Text>

        <ScrollView style={{ maxHeight: 400 }}>
          {filteredProducts.map((product) => (
            <View key={product._id} style={{ marginVertical: 10, flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: `http://10.0.2.2:5000${product.images[0].uri}` }}
                style={{ width: 80, height: 80, marginRight: 10, borderRadius: 8 }}
                resizeMode="cover"
              />
              <Text style={{ fontSize: 16 }}>{product.name} - ${product.price}</Text>
            </View>
          ))}
        </ScrollView>

      </View>

    </SafeAreaView>
  );
};

export default HomeScreen;
