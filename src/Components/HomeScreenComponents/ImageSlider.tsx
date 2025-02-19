import react, { useState, useRef } from "react";
import { View, Text, SafeAreaView, Dimensions, Animated, StyleSheet, Image } from "react-native";
import { useInterval } from "../../Hooks/useInterval";

import { ImageSourcePropType } from "react-native";

interface ImageProps {
    images: ImageSourcePropType[];
}

const Max_Width = Dimensions.get("screen").width;
const IMAGE_HEIGHT = Max_Width * 0.5; // ✅ Định nghĩa chiều cao ảnh dựa trên chiều rộng
const ImageSlider = ({ images }: ImageProps) => {
    const animation = useRef(new Animated.Value(0));
    const [currentImage, setCurrentImage] = useState(0);


    const handleAnimation = () => {
        let newCurrentImage = currentImage + 1;
        if (newCurrentImage > images.length - 1) {
            newCurrentImage = 0;
        }

        Animated.spring(animation.current, {
            toValue: -(Max_Width * newCurrentImage),
            useNativeDriver: true,
        }).start();

        setCurrentImage(newCurrentImage);
    };

    useInterval(() => handleAnimation(), 2000);

    return (
        <>
            <View>
                <Animated.View style={[styles.container, { transform: [{ translateX: animation.current }] }]}>
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: (image as any).uri }}
                            style={styles.image}
                        />

                    ))}
                </Animated.View>
            </View>
        </>
    );
};

export default ImageSlider;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#fff",
        alignItems: "center"
    },
    image: {
        resizeMode: "cover",
        height: 220,
        width: Dimensions.get("screen").width,
        borderWidth: 7,
        borderColor: "white"
    }
});
