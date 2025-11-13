import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider } from "./app/context/AuthContext";
import Home from "./app/screens/Home";
import Login from "./app/screens/Login";
import Trip from "./app/screens/Trip";
import TripSetting from "./app/screens/TripSetting";
import TripMember from "./app/screens/TripMember";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Trip" component={Trip} />
          <Stack.Screen name="TripSetting" component={TripSetting} />
          <Stack.Screen name="TripMember" component={TripMember} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
