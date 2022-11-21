import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainView from "./src/view/mainView";
import PoiView from "./src/view/poiView";
import React from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainView} />
        <Stack.Screen name="Tmap Search" component={PoiView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
