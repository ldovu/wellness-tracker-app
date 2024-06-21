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
import { saveTraining } from "../Data";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "../Components/DatePicker";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

/**
 * AddTrainingScreen models the screen for adding a training to the user's training.
 * The user can add: date, type of sport, duration, burnt calories, description, and an image.
 * The logged-in user is stored in the training as the value of "userTraining" attribute.
 * When the user adds a training, the training is saved in the AsyncStorage and
 * if the operation is successful, the user is redirected to the FitnessScreen.
 */

const AddTrainingScreen = () => {
  const { userData } = useUser();

  // Get the username of the logged-in user
  const userTraining = userData.username;

  // console.log(userData.username);  // ludov
  const [date, setDate] = useState("");
  const [sport, setSport] = useState("");
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedMinute, setSelectedMinute] = useState(null);
  const [burntCalories, setBurntCalories] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState({});
  const [error, setError] = useState("");

  const actionSheetRef = useRef();
  const navigation = useNavigation();

  // UseEffect hook to request permissions for accessing the camera and camera roll
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

  // Setting the possible variables for hours and minutes
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: `${i}`,
    value: i,
  }));

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleSportChange = (sport) => {
    setSport(sport);
  };
  const handleHoursChange = (hours) => {
    setSelectedHour(hours);
  };

  const handleMinutesChange = (minutes) => {
    setSelectedMinute(minutes);
  };

  const handleBurntCaloriesChange = (calories) => {
    const cleanedCalories = calories.replace(/[^0-9]/g, "");
    const parsedValue = parseInt(cleanedCalories, 10);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setBurntCalories(parsedValue.toString());
    } else {
      setError("Invalid age value");
    }
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
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

  // Function to handle the addition of a training
  const handleAddTraining = async () => {
    if (
      !date ||
      !sport ||
      selectedHour === null ||
      selectedMinute === null ||
      !burntCalories ||
      !description
    ) {
      setError("Fill main fields");
      return;
    }

    setError("");
    const stringDate = date.toDateString();
    const training = {
      userTraining,
      stringDate,
      sport,
      hours: selectedHour,
      minutes: selectedMinute,
      burntCalories,
      description,
      image,
    };
    console.log("Training:", training);
    try {
      // Server function for storing training with AsyncStorage
      await saveTraining(training);
      console.log("Training saved", training);

      // Navigate to the Training screen
      navigation.navigate("FitnessScreen");
    } catch (error) {
      console.error("Error saving training:", error);
      setError(error.message);
    }
  };

  /**
   * Render of the "Add Training" screen using the handle functions.
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
            <Text style={styles.text}>Add a Training</Text>
            <View style={styles.row}>
              <DatePicker onSelectDate={handleDateChange} />
            </View>
            <View style={styles.row}>
              <Text style={styles.textOptions}>Sport</Text>
              <View style={styles.containerPicker}>
                <RNPickerSelect
                  onValueChange={(value) => handleSportChange(value)}
                  items={[
                    { label: "Gym", value: "Gym" },
                    { label: "Running", value: "Running" },
                    { label: "Swimming", value: "Swimming" },
                    { label: "Cycling", value: "Cycling" },
                    { label: "Football", value: "Football" },
                    { label: "Basketball", value: "Basketball" },
                    { label: "Tennis", value: "Tennis" },
                    { label: "Volleyball", value: "Volleyball" },
                    { label: "Yoga", value: "Yoga" },
                    { label: "Martial Arts", value: "Martial Arts" },
                    { label: "Dance", value: "Dance" },
                    { label: "Other", value: "Other" },
                  ]}
                  style={pickerSelectStyles}
                  placeholder={{ label: "Select a sport...", value: null }}
                />
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.textOptions}>Duration</Text>

              <View style={styles.durationContainer}>
                <RNPickerSelect
                  onValueChange={handleHoursChange}
                  items={hours}
                  placeholder={{ label: "hrs...", value: null }}
                  style={pickerHrsMin}
                />

                <View style={styles.spaceBetween} />

                <RNPickerSelect
                  onValueChange={handleMinutesChange}
                  items={minutes}
                  placeholder={{ label: "min...", value: null }}
                  style={pickerHrsMin}
                />
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.textOptions}>Calories</Text>
              <TextInput
                style={styles.inputOptions}
                placeholder="128"
                value={burntCalories}
                onChangeText={handleBurntCaloriesChange}
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
                placeholder="Cardio workout and leg day: squats, leg press, leg curls"
                autoCapitalize="none"
                value={description}
                onChangeText={handleDescriptionChange}
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
              <Pressable style={styles.button} onPress={handleAddTraining}>
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

// Style definition for the AddTrainingScreen
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
    marginBottom: 30,
    marginTop: 30,
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

  durationContainer: {
    flexDirection: "row",
    marginRight: 40,
  },
  spaceBetween: {
    width: 10,
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

// Styles for the picker of sports
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 55,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
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
    // paddingLeft: 10,
    // paddingRight: 10,
    color: "#f9f8eb",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "YourCustomFont",
  },
  placeholder: {
    color: "#f9f8eb",
    fontFamily: "YourCustomFont",
    justifyContent: "center",
  },
});

// Styles for the picker of hours and minutes
const pickerHrsMin = StyleSheet.create({
  inputIOS: {
    width: 70,
    height: 40,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",
    color: "#f9f8eb",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "YourCustomFont",
  },
  inputAndroid: {
    width: "100%",
    height: 40,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "center",

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

export default AddTrainingScreen;
