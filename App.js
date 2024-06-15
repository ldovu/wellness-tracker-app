import { StatusBar } from "expo-status-bar";
import React, { useState, Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
// import { registerRootComponent } from 'expo';  // Import registerRootComponent  

// Screens
import SplashScreen from "./Screens/SplashScreen";
import Login from "./Screens/Login";
import Signup from "./Screens/Signup";
import LeftDrawer from "./Components/LeftDrawer";
import Heading from "./Components/Heading";
import Home from "./Screens/Home";


const Stack = createStackNavigator();

function App() {  // Remove export default
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* gestureEnabled not allow to go back by scrolling the page left */}
        <Stack.Screen name="Login" component={Login} 
        options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Signup" component={Signup}
        options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Home" component={Home} 
        options={{headerShown: false,  gestureEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// registerRootComponent(App);  // Register the App component

export default App;  // Export the App component
