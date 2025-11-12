import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import Login from "./screens/Login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: "홈" }} 
        />
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: "로그인" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
