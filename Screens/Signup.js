import React, { useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  Image,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import NumberInput from "../Components/NumberInput";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { addUser } from "../Data";

const Signup = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const [userWeight, setUserWeight] = useState("");
  const [userDiet, setUserDiet] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const handleNameChange = (newName) => {
    // VERIFICA
    setName(newName.replace(/\s/g, ""));
  };
  const handleSurnameChange = (newSurname) => {
    setSurname(newSurname);
  };
  const handleUsernameChange = (newUsername) => {
    setUsername(newUsername);
  };
  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
  };
  const handleUserGenderChange = (newGender) => {
    setUserGender(newGender);
  };
  const handleUserAgeChange = (newAge) => {
    const cleanedAge = newAge.replace(/[^0-9]/g, "");
    const parsedValue = parseInt(cleanedAge, 10);
    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue < 100) {
      setUserAge(parsedValue.toString());
    } else {
      setError("Invalid age value");
    }
  };
  const handleUserHeightChange = (newHeight) => {
    const cleanedHeight = newHeight.replace(/[^0-9]/g, "");
    const parsedValue = parseInt(cleanedHeight, 10);
    if (!isNaN(parsedValue) && parsedValue > 0 && parsedValue < 260) {
      setUserHeight(parsedValue.toString());
    } else {
      setError("Invalid height value");
    }
  };
  const handleUserWeightChange = (newWeight) => {
    // Remove any character that is not a digit or a dot
    const cleanedWeight = newWeight.replace(/[^0-9.]/g, "");
    const parsedValue = parseFloat(cleanedWeight);

    if (!isNaN(parsedValue) && parsedValue > 0) {
      setUserWeight(parsedValue.toString());
    } else {
      setError("Invalid weight value");
    }
  };
  const handleUserDietChange = (newDiet) => {
    setUserDiet(newDiet);
  };

  const handleSignup = async () => {
    if (
      !username ||
      !password ||
      !userGender ||
      !userAge ||
      !userHeight ||
      !userWeight ||
      !userDiet
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    const userProfile = {
      username,
      password,
      userGender,
      userAge,
      userHeight,
      userWeight,
      userDiet,
    };
    console.log("User profile before being saved:", userProfile);

    try {
      // Server function for storing user with AsyncStorage
      await addUser(userProfile);
      console.log("User profile saved", userProfile);

      // Navigate to the Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error.message);
    }
  };


// const isUsernameUnique = async (newUsername) => {
  //   const keys = await AsyncStorage.getAllKeys();
  //   const usernameExists = keys.some((key) => key === `${newUsername}_key`);
  //   return !usernameExists;
  // };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        <View style={styles.registrationContainer}>
          <Image
            source={require("../Images/logoapp.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Sign up</Text>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              autoCapitalize="none"
              value={username}
              onChangeText={handleUsernameChange}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={handlePasswordChange}
            />
          </View>

          <View style={styles.radioGroup}>
            <View style={styles.radioButton}>
              <RadioButton.Android
                value={userGender}
                status={userGender === "F" ? "checked" : "unchecked"}
                onPress={() => setUserGender("F")}
                color="#0b2b2f"
              />
              <Text style={styles.radioLabel}>F</Text>
            </View>

            <View style={styles.radioButton}>
              <RadioButton.Android
                value={userGender}
                status={userGender === "M" ? "checked" : "unchecked"}
                onPress={() => setUserGender("M")}
                color="#0b2b2f"
              />
              <Text style={styles.radioLabel}>M</Text>
            </View>

            <View style={styles.radioButton}>
              <RadioButton.Android
                value={userGender}
                status={userGender === "Other" ? "checked" : "unchecked"}
                onPress={() => setUserGender("Other")}
                color="#0b2b2f"
              />
              <Text style={styles.radioLabel}>Other</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Age:</Text>
            <TextInput
              style={styles.inputOptions}
              placeholder="30"
              value={userAge}
              onChangeText={handleUserAgeChange}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Height (cm):</Text>
            <TextInput
              style={styles.inputOptions}
              placeholder="170"
              value={userHeight}
              onChangeText={handleUserHeightChange}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.textOptions}>Weight (kg):</Text>
            <TextInput
              style={styles.inputOptions}
              placeholder="70"
              value={userWeight}
              onChangeText={handleUserWeightChange}
              keyboardType="numeric"
            />
          </View>
          {/* <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.buttonOptionsDiet}
              onPress={() => handleUserDietChange("Vegetarian")}
            >
              <Text style={styles.buttonTextOptions}>Vegetarian</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOptionsDiet}
              onPress={() => handleUserDietChange("Vegan")}
            >
              <Text style={styles.buttonTextOptions}>Vegan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOptionsDiet}
              onPress={() => handleUserDietChange("Omnivorous")}
            >
              <Text style={styles.buttonTextOptions}>Omnivorous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonOptionsDiet}
              onPress={() => handleUserDietChange("Other")}
            >
              <Text style={styles.buttonTextOptions}>Other</Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.row}>
            <Text style={styles.textOptions}>Diet</Text>
            <View style={styles.containerPicker}>
              <RNPickerSelect
                onValueChange={(value) => handleUserDietChange(value)}
                items={[
                  { label: "Vegetarian", value: "Vegetarian" },
                  { label: "Vegan", value: "Vegan" },
                  { label: "Omnivorous", value: "Omnivorous" },
                  { label: "Other", value: "Other" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Select a diet...", value: null }}
              />
            </View>
          </View>

          <View style={styles.row}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable style={styles.buttonRegistration} onPress={handleSignup}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
          </View>
          <View style={styles.row}>
            <View style={styles.backToLogin}>
              <Text style={styles.text}>Back to</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.linkText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    marginTop: 100,
    backgroundColor: "#f9f8eb",
    marginBottom: 40,

  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  registrationContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  rowRadioButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },

  radioButtonStyle: {
    fontSize: 20,
  },

  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f9f8eb",
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 28,
  },
  radioLabel: {
    marginLeft: 4,
    fontSize: 20,
    color: "#333",
  },

  input: {
    width: "80%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    marginRight: 5,
    fontSize: 20,
    justifyContent: "center",
  },
  optionsThreeInRow: {
    width: "30%",
    marginBottom: 5,
    justifyContent: "center",
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

  buttonRegistration: {
    width: "80%",
    height: 45,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  buttonOptionsDiet: {
    width: "16%",
    height: 35,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginRight: 10,
  },
  buttonTextOptions: {
    color: "#f9f8eb",
    fontSize: 12,
    fontWeight: "bold",
  },

  buttonText: {
    color: "#f9f8eb",
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 20,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    marginLeft: 5,
    fontSize: 20,
  },

  backToLogin: { flexDirection: "row", marginTop: 20 },

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

export default Signup;
