import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useUser } from "../Components/UserContext";
import { useNavigation } from "@react-navigation/native";
import { saveMeal } from "../Data";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "../Components/DatePicker";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

/**
 * AddMealScreen models the screen for adding a meal to the user's diet.
 * The user can add: date, meal, calories, description and image of the meal.
 * The logged-in user is stored in the meal as the value of the "userMeal" attribute.
 * When the user adds a meal, the meal is stored in AsyncStorage and
 * if the operation is successful, the user is redirected to the Diet screen.
 */

const AddMealScreen = () => {
  const { userData } = useUser();

  // Get the username of the logged-in user
  const userMeal = userData.username;

  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [calories, setCalories] = useState("");
  const [mealDetails, setMealDetails] = useState("");
  const [image, setImage] = useState({});
  const [error, setError] = useState("");

  const actionSheetRef = useRef();
  const navigation = useNavigation();

  // useEffect hook to request permissions for accessing the camera and camera roll
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: libraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();

        // If permissions are not granted, show an alert to the user
        if (libraryStatus !== "granted" || cameraStatus !== "granted") {
          Alert.alert(
            "Permissions required",
            "Sorry, we need camera and camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

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

  const handleImage = (uri) => {
    setImage(uri);
  };

  // Function to pick an image from the camera roll
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };

  // Function to take a photo with the camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };

  // Function to handle the selection from an action sheet
  const handleActionSheet = async (actionIndex) => {
    if (actionIndex === 0) {
      await pickImage();
    } else if (actionIndex === 1) {
      await takePhoto();
    }
  };

  // Displays the action sheet by calling the `show` method on the action sheet reference.
  const showActionSheet = () => {
    actionSheetRef.current.show();
  };

  // Function that handle the addition of a meal
  const handleAddMeal = async () => {
    // Necessary fields for adding a meal
    if (!date || !category || !mealDetails) {
      setError("Fill main fields");
      return;
    }
    setError("");
    stringDate = date.toDateString();

    // Meal object to be stored in AsyncStorage
    const meal = {
      userMeal,
      stringDate,
      category,
      calories,
      mealDetails,
      image,
    };
    try {
      // Server function for storing meal with AsyncStorage
      await saveMeal(meal);
      console.log("Meal saved", meal);

      // Navigation to the Diet screen
      navigation.navigate("DietScreen");
    } catch (error) {
      console.error("Error saving meal:", error);
      setError(error.message);
    }
  };

  /**
   * Render of the "Add Meal" screen using the handle functions.
   * It uses KeyboardAvoidingView to ensure the keyboard does not cover input fields.
   * and ScrollView to allow scrolling if the content exceeds the screen size.
   */
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
                maxLength={100}
                style={styles.inputBox}
                placeholder="Avocado toast with eggs and a side of fruit."
                autoCapitalize="none"
                value={mealDetails}
                onChangeText={handleMealDetailsChange}
              />
            </View>
            <View style={styles.row}>
              <TouchableOpacity onPress={showActionSheet}>
                <View style={styles.row}>
                  <Text style={styles.addPicText}>Add a pic: </Text>
                  <Icon name="add-a-photo" size={30} style={styles.iconPic} />
                </View>
              </TouchableOpacity>
              {image && (
                <View style={styles.row}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                </View>
              )}
            </View>

            <View style={styles.row}>
              <Pressable style={styles.button} onPress={handleAddMeal}>
                <Text style={styles.buttonText}>Add</Text>
              </Pressable>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </View>
        <ActionSheet
          ref={actionSheetRef}
          title={"Choose an option"}
          options={["Pick an image from camera roll", "Take a photo", "Cancel"]}
          cancelButtonIndex={2}
          onPress={(index) => handleActionSheet(index)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Style definition for the AddMealScreen
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
    marginBottom: 20,
    marginTop: -20,
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

  addPicText: {
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 200,
    fontWeight: "bold",
  },
  iconPic: {
    color: "#0b2b2f",
    marginBottom: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginTop: 10,
    borderRadius: 4,
    marginRight: 160,
  },
});

// Styles for the picker of meal types
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
