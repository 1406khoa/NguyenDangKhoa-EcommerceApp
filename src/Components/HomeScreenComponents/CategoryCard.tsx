import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import React from "react";

const { width } = Dimensions.get("window"); // Lấy chiều rộng màn hình

type CategoryCardProps = {
  image: any;
  title: string;
  onPress: () => void;
};

const CategoryCard = ({ image, title, onPress }: CategoryCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
      </View>
      <View style={styles.overlay}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.8, // Giảm chiều rộng xuống 80% để có khoảng trống cho nút chuyển danh mục
    height: 200,
    position: "relative",
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
  },
});
