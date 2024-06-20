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
import { saveMeal, saveTraining,  } from "../Data";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "../Components/DatePicker";
import DietScreen from "./DietScreen";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

import TrainingScreen from "./TrainingScreen";

const AddTrainingScreen = () => {
  const { userData } = useUser();

  // The user associated with the training is the logged in user
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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status: libraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();

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

  console.log("Selected hour:", selectedHour);
  console.log("Selected minute:", selectedMinute);

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

  const handleActionSheet = async (actionIndex) => {
    if (actionIndex === 0) {
      await pickImage();
    } else if (actionIndex === 1) {
      await takePhoto();
    }
  };

  const showActionSheet = () => {
    actionSheetRef.current.show();
  };

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
    // const duration = `${hours}h ${minutes}m`;
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
      console.log("Saving", training);
      await saveTraining(training);
      console.log("Training saved", training);

      // Navigate to the Training screen
      navigation.navigate("TrainingScreen");
    } catch (error) {
      console.error("Error saving training:", error);
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
                maxLength={40}
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    height: 55,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    // paddingLeft: 10,
    // paddingRight: 10,
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
