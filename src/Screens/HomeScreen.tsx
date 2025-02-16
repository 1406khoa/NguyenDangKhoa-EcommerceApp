import { View, Text, Platform, ScrollView, ImageSourcePropType } from "react-native";
import React, { useEffect, useState } from "react";
import { TabsStackScreenProps } from "../Navigation/TabsNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import HeadersComponent from "../Components/HeaderComponents/HeaderComponent";
import ImageSlider from "../Components/HomeScreenComponents/ImageSlider"
import axios from 'axios'

const HomeScreen = ({ navigation, route }: TabsStackScreenProps<"Home">) => {
  const gotoCartScreen = () => {
    navigation.navigate("Cart");
  };

  const [sliderImages, setSliderImages] = useState<ImageSourcePropType[]>([]);

  // const sliderImage = [
  //   require("../../assets/product1.jpg"),
  //   require("../../assets/product2.jpg"),
  //   require("../../assets/product3.jpg")
  // ];

  useEffect(() => {
    axios.get('http://10.0.2.2:5000/api/products')
      .then(response => {
        const imagesFromAPI = response.data.flatMap((product: any) => product.images.map((img: any) => ({ uri: `http://10.0.2.2:5000${img.uri}` })));
        setSliderImages(imagesFromAPI);
      })
      .catch(error => console.error(error));
  }, []);

  console.log('Slider Images:', sliderImages);


  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === "android" ? 40 : 0,
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <HeadersComponent gotoCartScreen={gotoCartScreen} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ImageSlider images={sliderImages} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
