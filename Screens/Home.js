import React, { useEffect, useState, createContext, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../Data";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UserProvider } from "./UserContext";

import TrainingScreen from "./TrainingScreen";
import DietScreen from "./DietScreen";
import SettingScreen from "./SettingScreen";
import SplashScreen from "./SplashScreen";

const Tab = createBottomTabNavigator();

const Home = ({ route }) => {
  const user = route?.params?.user;

  const [userData, setUserData] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUser(user.username);
        if (userData) {
          setUserData(userData);
          console.log("User data in Home:", userData);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, [user]);
  if (!userData) {
    return <SplashScreen />; // Render a loading screen or placeholder while fetching data
  }

  return (
    // <SafeAreaView style={styles.container}>
    //   <ScrollView contentContainerStyle={styles.scrollViewContent}>
    //     <Text style={styles.title}>Home Screen</Text>
    //     <Text style={styles.welcome}>Welcome, {user.username}!</Text>
    //     <Text style={styles.welcome}>gender: {user.userGender}</Text>
    //     <Text style={styles.welcome}>age: {user.userAge}</Text>
    //     <Text style={styles.welcome}>height: {user.userHeight}</Text>
    //     <Text style={styles.welcome}>weight: {user.userWeight}</Text>
    //     <Text style={styles.welcome}>diet: {user.userDiet}</Text>
    //   </ScrollView>
    // </SafeAreaView>
    <UserProvider value={userData}>
      <Tab.Navigator styles={styles.tabNavigator}>
        <Tab.Screen
          name="Diet"
          component={DietScreen}
        />
        <Tab.Screen
          name="Fitness"
          component={TrainingScreen}
        />
        <Tab.Screen
          name="Settings"
          component={SettingScreen}
        />
      </Tab.Navigator>
    </UserProvider>
  );
};

const styles = StyleSheet.create({
  tabNavigator: {
    backgroundColor: "#f9f8eb",
  },
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#f9f8eb",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 40,
    marginBottom: 16,
  },
});

export default Home;
