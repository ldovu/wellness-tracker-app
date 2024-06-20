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
import { createStackNavigator } from "@react-navigation/stack";
import { useUser, UserProvider } from "./UserContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MenuProvider } from "react-native-popup-menu";
import TrainingScreen from "./TrainingScreen";
import DietScreen from "./DietScreen";
import UserProfileScreen from "./UserProfileScreen";
import SettingScreen from "./UserProfileScreen";
import SplashScreen from "./SplashScreen";
import CustomHeader from "../Components/CustomHeader";
import AddMealScreen from "./AddMealScreen";
import AddTrainingScreen from "./AddTrainingScreen";
import EditUserScreen from "./EditUserScreen";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

const TrainingStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TrainingScreen"
      component={TrainingScreen}
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
  // Render a loading screen or placeholder while fetching data
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
          <Tab.Screen name="Fitness " component={TrainingStack} />
          <Tab.Screen name="Profile  " component={UserProfileStack} />
        </Tab.Navigator>
      </MenuProvider>
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