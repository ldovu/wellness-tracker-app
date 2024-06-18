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
  Dimensions,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useUser } from "./UserContext";
import {
  deleteLastUser,
  getUsers,
  getMeals,
  saveMeal,
  deleteTraining,
  fetchImages,
  saveImage,
  removeImage,
} from "../Data";
import * as ImagePicker from "expo-image-picker";
import ActionSheet from "react-native-actionsheet";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from "../Components/DatePicker";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import logoapp from "../Images/logoapp.png";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
// import { Ionicons as Icon } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// AIzaSyCplMxmKITQRTICaFtwSbemqES491_VMxA

const SettingsScreen = () => {
  const userData = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Handle function for adding a photo:
  //    it shows a dropdown menu and allow the user to pick an image from the gallery
  //    or take a photo with the camera
  
  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({
      index: 0,
      actions: [navigation.navigate("Login")],
    });
    console.log("User logged out");
    setModalVisible(false);
  };

  const handleGetUsers = async () => {
    const users = await getUsers();
    console.log("Users:", users);
  };
  // const handleRemoveUser = async () => {
  //   console.log("Removing user");
  //   const deleted = await deleteLastUser();
  //   if (deleted) {
  //     Alert.alert("User deleted successfully");
  //   } else {
  //     Alert.alert("Error deleting the user");
  //   }
  // };

  // const handleRemoveTraining = async () => {
  //   console.log("Removing training");
  //   const deleted = await deleteTraining();
  //   if (deleted) {
  //     Alert.alert("User deleted successfully");
  //   } else {
  //     Alert.alert("Error deleting the user");
  //   }
  // };

  console.log("User data in Diet:", userData);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text>Diet Screen</Text>

        <Text>User Data: {userData.username}</Text>
        <Button title="Get Users" onPress={handleGetUsers} />
        <Icon name="add-a-photo" size={30} color="#0b2b2f" />

        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Are you sure to logout?</Text>
                <View style={{ flexDirection: "row" }}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={handleLogout}
                  >
                    <Text style={styles.textStyle}>Yes</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>No</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textStyle}>Show Modal</Text>
          </Pressable>
        </View>
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
  buttonContainer: {
    marginBottom: 20,
    backgroundColor: "#0b2b2f",
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  autocompleteContainer: {
    flex: 1,
    width: "100%",
  },
  textInputContainer: {
    backgroundColor: "white",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    backgroundColor: "#ffffff",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    height: 44,
    elevation: 2,
  },
  listView: {
    backgroundColor: "white",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default SettingsScreen;
