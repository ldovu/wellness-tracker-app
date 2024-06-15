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
import { useUser } from "./UserContext";
import { useNavigation } from "@react-navigation/native";

const TrainingScreen = () => {
  const navigation = useNavigation();
  const userData = useUser();

  const handleAddMealPress = () => {
    navigation.navigate("AddTraining");
  };

  console.log("User data in Training:", userData);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity style={styles.button} onPress={handleAddMealPress}>
          <Text style={styles.buttonText}> + Add New Training</Text>
        </TouchableOpacity>
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
    width: "70%",
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

  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
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

export default TrainingScreen;
