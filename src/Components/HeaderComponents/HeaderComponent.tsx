import { View, Text, StyleSheet, Pressable, TextInput, FlatList, TouchableOpacity, Keyboard  } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { GoBack } from "./GoBackButton";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "../../Navigation/RootNavigator";

interface IHeaderParams {
  goToPrevios?: () => void;
  cartLength?: number;
  gotoCartScreen?: () => void;
  allProducts: any[]; // Truyền danh sách sản phẩm từ HomeScreen
}
export const HeadersComponent = ({ goToPrevios, cartLength, gotoCartScreen, allProducts }: IHeaderParams) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  useEffect(() => {
    if (searchInput.length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchInput, allProducts]);

  const handleSelectProduct = (productId: string) => {
    setSearchInput("");
    setFilteredProducts([]);
    navigation.navigate("ProductDetail", { productId });
  };

  const handleSearchSubmit = () => {
    if (filteredProducts.length === 1) {
      navigation.navigate("ProductDetail", { productId: filteredProducts[0]._id });
    } else if (filteredProducts.length > 1) {
      alert("Có nhiều sản phẩm trùng khớp, vui lòng chọn!");
    } else {
      alert("Không tìm thấy sản phẩm nào.");
    }
    Keyboard.dismiss(); // Ẩn bàn phím sau khi tìm kiếm
  };
  
  return (
    <View style={{ backgroundColor: "blue", padding: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <GoBack onPress={goToPrevios} />
        <Pressable style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="blue" style={{ padding: 10 }} />
          <TextInput
            value={searchInput}
            onChangeText={setSearchInput}
            placeholder="Search"
            style={{ flex: 1 }}
            autoCapitalize="none"
            returnKeyType="search" // ✅ Hiển thị nút "Search" trên bàn phím
            onSubmitEditing={handleSearchSubmit} // ✅ Nhấn Enter để tìm kiếm
          />
        </Pressable>
        <Pressable onPress={gotoCartScreen}>
          <View style={styles.cartNum}>
            <Text style={{ color: "pink" }}>{cartLength}</Text>
          </View>
          <MaterialIcons name="shopping-cart" size={24} color={"white"} style={{ padding: 5, marginTop: 3 }} />
        </Pressable>
      </View>

      {filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          style={styles.suggestionList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectProduct(item._id)} style={styles.suggestionItem}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 10,
    height: 38,
    flex: 1,
  },
  cartNum: {
    position: "absolute",
    right: 0,
    top: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionList: {
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 5,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});

export default HeadersComponent;
