import { View, Text, Platform } from 'react-native'
import React from 'react'
import { TabsStackScreenProps } from '../Navigation/TabsNavigation'
import { SafeAreaView } from 'react-native-safe-area-context'

type Props = {}

const HomeScreen = ({navigation, route}: TabsStackScreenProps<"Home">) => {
  return (
    <SafeAreaView style = {{paddingTop: Platform.OS === 'android' ? 40 : 0, flex: 1, backgroundColor: 'black'}}>

    </SafeAreaView>
  )
}

export default HomeScreen