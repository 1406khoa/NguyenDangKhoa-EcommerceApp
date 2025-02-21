import React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import OnboardingScreen from "../Screens/OnboardingScreen"
import ProductDetail from "../Screens/ProductDetail"

import TabsNavigator, { TabsStackParams } from "./TabsNavigation"
import CategoryScreen from "../Screens/CategoryScreen";
import { Product } from "../TypesCheck/GlobalTypes";

export type RootStackParams = {
    OnboardingScreen: undefined
    TabsStack: undefined
    CategoryScreen: { categoryId: string; categoryName: string; products: Product[] }; // ✅ Thêm categoryName & products
    ProductDetail: { productId: string }; // ✅ Thêm ProductDetail vào danh sách điều hướng
    
}

const RootStack = createNativeStackNavigator<RootStackParams>();
export type RootStackScreenProps<T extends keyof RootStackParams> = NativeStackScreenProps<RootStackParams, T>;

const RootNavigator = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="TabsStack"
                component={TabsNavigator}
                options={{ headerShown: false }}
            />

            <RootStack.Screen
                name="CategoryScreen"
                component={CategoryScreen}
            />

            <RootStack.Screen
                name="ProductDetail"
                component={ProductDetail}
            />
        </RootStack.Navigator>
    )
}

export default RootNavigator
