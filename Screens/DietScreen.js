import React, { useEffect, useState, useRef } from "react";
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
  Alert,
  Image,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUser } from "./UserContext";
import { loadMeals, saveMeals } from "../Data";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from "../Components/DatePicker";

const DietScreen = () => {
  const navigation = useNavigation();
  const userData = useUser();

  const handleAddMealPress = () => {
    navigation.navigate("AddMeal");
  };

  // console.log("User data in Diet:", userData);
  const [date, setDate] = useState("");


  // Hook: first parameter -> function that represents the "effect"
  //       second parameter -> optional array of dependencies:
  //                          - react rerun the effect only when dependencies has changed
  //                          - if dependencies array is omitted, the effects runs after every render
  // useEffect(() => {
  //   (async () => {
  //     const storedMeals = await loadMeals();
  //     setMeals(storedMeals);
  //   })();
  // }, []);



  const handleDate = (date) => {
    setDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.button} onPress={handleAddMealPress}>
          <Text style={styles.buttonText}> + Add New Meal</Text>
        </TouchableOpacity>
        <Text>Diet Screen</Text>
        <Text>{userData.username}</Text>
        <Text>{date ? date.toDateString() : "None"}</Text>
        <DatePicker onSelectDate={handleDate} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#f9f8eb",
  },

  image: {
    width: 100,
    height: 100,
  },
  button: {
    width: "60%",
    height: 45,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#f9f8eb",
    fontSize: 22,
    fontWeight: "bold",
  },

  buttonContainer: {
    marginBottom: 20,
  },

  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 20,
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

export default DietScreen;
