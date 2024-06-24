import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { useUser } from "../Components/UserContext";
import { useNavigation } from "@react-navigation/native";
import { updateUser } from "../Data";
import { RadioButton } from "react-native-paper";
import RNPickerSelect from "react-native-picker-select";

/**
 * EditUserScreen models the screen for editing the user's profile details.
 * The user can only edit the profile details, not the username or password.
 */

const EditUserScreen = () => {
  const { userData } = useUser();
  const [userAge, setUserAge] = useState(userData.userAge);
  const [userDiet, setUserDiet] = useState(userData.userDiet);
  const [userGender, setUserGender] = useState(userData.userGender);
  const [userHeight, setUserHeight] = useState(userData.userHeight);
  const [userWeight, setUserWeight] = useState(userData.userWeight);
  const [error, setError] = useState("");

  const navigation = useNavigation();
  const loggedUser = userData.username;

  // Function for handling the update of the user's profile: if the user does not change a field, the old value is kept
  const handleUpdate = async () => {
    const updatedAttributes = {
      userAge: userAge || userData.userAge,
      userDiet: userDiet || userData.userDiet,
      userGender: userGender || userData.userGender,
      userHeight: userHeight || userData.userHeight,
      userWeight: userWeight || userData.userWeight,
    };

    try {
      await updateUser(loggedUser, updatedAttributes);
      console.log("Profile updated successfully."); // Debugging message
      navigation.navigate("UserProfileScreen");
    } catch (error) {
      console.error("An error occurred while updating profile.");
      setError(error.message);
    }
  };

  // Render of the EditUserScreen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          <View style={styles.container}>
            <Text style={styles.title}>Edit profile details </Text>

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
                onChangeText={setUserAge}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.textOptions}>Height (cm):</Text>
              <TextInput
                style={styles.inputOptions}
                placeholder="170"
                value={userHeight}
                onChangeText={setUserHeight}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.row}>
              <Text style={styles.textOptions}>Weight (kg):</Text>
              <TextInput
                style={styles.inputOptions}
                placeholder="70"
                value={userWeight}
                onChangeText={setUserWeight}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.row}>
              <Text style={styles.textOptions}>Diet</Text>
              <View style={styles.containerPicker}>
                <RNPickerSelect
                  onValueChange={setUserDiet}
                  items={[
                    { label: "Vegetarian", value: "Vegetarian" },
                    { label: "Vegan", value: "Vegan" },
                    { label: "Omnivorous", value: "Omnivorous" },
                    { label: "Other", value: "Other" },
                  ]}
                  style={pickerSelectStyles}
                  placeholder={{ label: "Select a diet...", value: null }}
                  value={userDiet}
                />
              </View>
            </View>

            <View style={styles.row}>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Pressable style={styles.buttonUpdate} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Update</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Style definition for the EditUserScreen
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
    marginTop: 90,
    backgroundColor: "#f9f8eb",
    marginBottom: 30,
  },
  registrationContainer: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: -60,
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
    // marginTop: 5,
    // marginBottom: 8,
    marginLeft: 20,
    borderRadius: 8,
    backgroundColor: "#f9f8eb",
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  buttonUpdate: {
    width: "80%",
    height: 45,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#f9f8eb",
    fontSize: 24,
    fontWeight: "bold",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    marginLeft: 5,
    fontSize: 20,
  },
});

// Style definition for the picker component
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
export default EditUserScreen;
