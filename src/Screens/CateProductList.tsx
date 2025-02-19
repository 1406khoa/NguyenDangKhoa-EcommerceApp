import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParams } from "../Navigation/RootNavigator";
import axios from "axios";

type Props = StackScreenProps<RootStackParams, "ProductDetail">;

const CateProductList = ({ route }: Props) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://10.0.2.2:5000/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [productId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#00970a" />
      ) : (
        <>
          <Image source={{ uri: `http://10.0.2.2:5000${product.images[0].uri}` }} style={styles.image} />
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price} $</Text>
          <Text style={styles.description}>{product.description}</Text>
        </>
      )}
    </View>
  );
};

export default CateProductList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    fontSize: 18,
    color: "green",
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
});
