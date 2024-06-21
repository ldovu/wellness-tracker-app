import React, { useEffect, useState } from "react";
import { StyleSheet, StatusBar } from "react-native";
import { getUser } from "../Data";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "../Components/UserContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MenuProvider } from "react-native-popup-menu";
import FitnessScreen from "./FitnessScreen";
import DietScreen from "./DietScreen";
import UserProfileScreen from "./UserProfileScreen";
import SplashScreen from "./SplashScreen";
import CustomHeader from "../Components/CustomHeader";
import AddMealScreen from "./AddMealScreen";
import AddTrainingScreen from "./AddTrainingScreen";
import EditUserScreen from "./EditUserScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigators for the Diet, Training, and User Profile screens
const DietStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DietScreen"
      component={DietScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddMeal"
      component={AddMealScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const FitnessStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FitnessScreen"
      component={FitnessScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AddTraining"
      component={AddTrainingScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const UserProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="UserProfileScreen"
      component={UserProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditUserScreen"
      component={EditUserScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

/**
 * Home screen defines the skeleton of the app's main screen
 * Create a Tab Navigator with the DietStack, TrainingStack, and UserProfileStack
 * Uses UserProvider to provide the user data to its children
 */
const Home = ({ route }) => {
  const user = route?.params?.user;
  const [userData, setUserData] = useState("");

  // Hook to fetch user data when the screen is loaded
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
  // Render splash screen while fetching data
  if (!userData) {
    return <SplashScreen />;
  }

  return (
    <UserProvider value={userData}>
      <MenuProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;

              if (route.name === "Diet       ") {
                iconName = "restaurant-menu";
              } else if (route.name === "Fitness ") {
                iconName = "fitness-center";
              } else if (route.name === "Profile  ") {
                iconName = "person";
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#0b2b2f",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: "#edeac4",
              height: 90,
            },
            headerStyle: {
              backgroundColor: "#edeac4",
              height: 110,
            },
            headerTintColor: "#0b2b2f",
            headerTitle: (props) => (
              <CustomHeader
                title={props.children}
                iconName="menu" // Example icon name
                username={userData.username} // Pass username to CustomHeader
              />
            ),
            headerTitleAlign: "left", // Align header title centrally
            headerTitleStyle: {
              fontSize: 24,
              fontWeight: "bold",
            },
          })}
        >
          <Tab.Screen name="Diet       " component={DietStack} />
          <Tab.Screen name="Fitness " component={FitnessStack} />
          <Tab.Screen name="Profile  " component={UserProfileStack} />
        </Tab.Navigator>
      </MenuProvider>
    </UserProvider>
  );
};

export default Home;
