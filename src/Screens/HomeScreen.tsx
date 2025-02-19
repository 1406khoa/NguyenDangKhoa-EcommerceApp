import { Category, Product } from "../TypesCheck/GlobalTypes"; // ✅ Import types từ `TypesCheck`
import { View, Text, Platform, ScrollView, ImageSourcePropType, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider";
import CategoryCard from "../Components/HomeScreenComponents/CategoryCard";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

// ✅ Định nghĩa kiểu dữ liệu cho useState để tránh lỗi 'never'
const HomeScreen = ({ navigation }: TabsStackScreenProps<"Home">) => {
  const gotoCartScreen = () => {
    navigation.navigate("Cart");
  };

  const [sliderImages, setSliderImages] = useState<ImageSourcePropType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // ✅ Chỉ định kiểu dữ liệu
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]); // ✅ Chỉ định kiểu dữ liệu

  // ✅ Lấy danh sách sản phẩm cho ImageSlider (TẤT CẢ sản phẩm)
  useEffect(() => {
    axios
      .get<Product[]>("http://10.0.2.2:5000/api/products")
      .then((response) => {
        const imagesFromAPI = response.data.flatMap((product) =>
          product.images.map((img) => ({ uri: `http://10.0.2.2:5000${img.uri}` }))
        );
        setSliderImages(imagesFromAPI);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .get<Category[]>("http://10.0.2.2:5000/api/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error(error));
  }, []);




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
      <HeadersComponent gotoCartScreen={gotoCartScreen} />

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
                products: products, // ✅ Truyền danh sách sản phẩm luôn
              })
            }
          />
        )}

        {/* Nút chuyển danh mục bên phải */}
        <TouchableOpacity onPress={handleNext} style={{ padding: 10 }}>
          <AntDesign name="rightcircle" size={40} color="black" />
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
};

export default HomeScreen;
