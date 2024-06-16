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
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useUser } from "./UserContext";
import { useNavigation } from "@react-navigation/native";
import { saveMeal } from "../Data";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "../Components/DatePicker";
import DietScreen from "./DietScreen";

const AddMealScreen = () => {
  const userData = useUser();

  // The user associated with the meal is the logged in user
  const userMeal = userData.username;

  // console.log(userData.username);  // ludov
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState("");
  const [mealDetails, setMealDetails] = useState("");

  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };
  const handleCaloriesChange = (calories) => {
    const cleanedCalories = calories.replace(/[^0-9]/g, "");
    const parsedValue = parseInt(cleanedCalories, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setCalories(parsedValue.toString());
    } else {
      setError("Invalid age value");
    }
  };

  const handleMealDetailsChange = (mealDetails) => {
    setMealDetails(mealDetails);
  };

  const handleAddMeal = async () => {
    if (!date || !category || !mealDetails) {
      setError("Fill main fields");
      return; 
    }

    setError("");
    stringDate = date.toDateString();
    // console.log("Tipo date:", typeof date);   // object
    // console.log("Date:", date);               // 2024-06-16T08:26:56.740Z
    // console.log("Tipo string date:", typeof stringDate);  // string
    // console.log("String date:", stringDate);   // Sun Jun 16 2024

    const meal = {
      userMeal,
      stringDate,
      category,
      calories,
      mealDetails,
    };
    console.log("Meal:", meal);
    try {
      // Server function for storing meal with AsyncStorage
      await saveMeal(meal);
      console.log("Meal saved", meal);

      // Navigate to the Diet screen
      navigation.navigate("DietScreen");
    } catch (error) {
      console.error("Error saving meal:", error);
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
        <View style={styles.container}>
          <Text style={styles.text}>Add Meal Screen</Text>
          <View style={styles.row}>
            <DatePicker onSelectDate={handleDateChange} />
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Meal</Text>
            <View style={styles.containerPicker}>
              <RNPickerSelect
                onValueChange={(value) => handleCategoryChange(value)}
                items={[
                  { label: "Breakfast", value: "Breakfast" },
                  { label: "Lunch", value: "Lunch" },
                  { label: "Dinner", value: "Dinner" },
                  { label: "Snack", value: "Snack" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a type...", value: null }}
              />
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Calories</Text>
            <TextInput
              style={styles.inputOptions}
              placeholder="128"
              value={calories}
              onChangeText={handleCaloriesChange}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Details</Text>
          </View>
          <View style={styles.row}>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              style={styles.inputBox}
              placeholder="Avocado toast with eggs and a side of fruit."
              autoCapitalize="none"
              value={mealDetails}
              onChangeText={handleMealDetailsChange}
            />
          </View>

          <View style={styles.row}>
            
            <Pressable style={styles.button} onPress={handleAddMeal}>
              <Text style={styles.buttonText}>Add</Text>
            </Pressable>
            
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f9f8eb",
  },
  content: {
    flex: 1,
    backgroundColor: "#f9f8eb",
    marginBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f8eb",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    width: "80%",
    height: 45,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  containerPicker: {
    width: "40%",
    marginRight: 40,
  },
  textOptions: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 40,
    fontWeight: "bold",
  },
  inputOptions: {
    width: "40%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 20,
    marginRight: 40,
  },
  inputBox: {
    height: 100,
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontSize: 20,
    color: "#0b2b2f",
  },
  buttonText: {
    color: "#f9f8eb",
    fontSize: 24,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 55,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,

    color: "#f9f8eb",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "YourCustomFont",
  },
  inputAndroid: {
    width: "100%",
    height: 55,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: "#f9f8eb",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "YourCustomFont",
  },
  placeholder: {
    color: "#f9f8eb",
    fontFamily: "YourCustomFont",
  },
});

export default AddMealScreen;
