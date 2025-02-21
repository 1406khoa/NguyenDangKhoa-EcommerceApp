import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/RootNavigator";

type Props = StackScreenProps<RootStackParams, "CategoryScreen">;

const CategoryScreen = ({ route, navigation }: Props) => {
  const { categoryId, categoryName, products } = route.params; // ✅ Nhận dữ liệu từ HomeScreen

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh mục: {categoryName}</Text>

      <FlatList
        data={products} // ✅ Hiển thị danh sách sản phẩm đã được truyền
        keyExtractor={(item) => item._id}
        numColumns={2} // ✅ Hiển thị dạng lưới 2 cột
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ProductDetail", { productId: item._id })} // ✅ Điều hướng đến ProductDetail
          >
            <Image source={{ uri: `http://10.0.2.2:5000${item.images[0].uri}` }} style={styles.image} />
            <Text style={styles.name}>{item.name} </Text>
            <Text style={styles.price}>Price: {item.price}$</Text>
          </TouchableOpacity>

        )}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    color: "gray",
    marginTop: 3,
  },
});
