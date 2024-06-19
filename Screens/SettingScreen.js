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
  SectionList,
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
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
// import { Ionicons as Icon } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

// AIzaSyCplMxmKITQRTICaFtwSbemqES491_VMxA

const SettingsScreen = () => {
  // const userData = useUser();
  const { userData } = useUser();

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Handle function for adding a photo:
  //    it shows a dropdown menu and allow the user to pick an image from the gallery
  //    or take a photo with the camera

  console.log("User data in settings:", userData);
  // console.log("Username in settings:", username);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>

          <Text style={styles.text}>User Profile</Text>
          <View style={styles.listUserOptions}>
          <Text style={styles.textOptions}>{`\u25AA `}Username: {userData.username}</Text>
          <Text style={styles.textOptions}>{`\u25AA `}Age: {userData.userAge}</Text>
          <Text style={styles.textOptions}>{`\u25AA `}Diet: {userData.userDiet}</Text>
          <Text style={styles.textOptions}>{`\u25AA `}Gender: {userData.userGender}</Text>
          <Text style={styles.textOptions}>
          {`\u25AA `}Height: {userData.userHeight} cm
          </Text>
          <Text style={styles.textOptions}>
          {`\u25AA `} Weight: {userData.userWeight} kg
          </Text>
          </View>
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}> Logout</Text>
        </TouchableOpacity>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.backgroundOverlay} />
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure you want to logout?
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.confirmButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.buttonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#f9f8eb",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    // marginRight: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: 20,
  },
  listUserOptions: {
    flex: 1,
    marginRight: 40,
    marginTop: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  textOptions: {
    fontSize: 18,
    marginVertical: 10,
  },
  button: {
    position: "absolute",
    bottom: 10,
    width: "60%",
    height: 45,
    backgroundColor: "#810000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 5,
    alignSelf: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: "#f9f8eb",
    fontSize: 22,
    fontWeight: "bold",
  },

  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 24,
    fontWeight: "bold",
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
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

  textOptions: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 40,
    fontWeight: "bold",
  },


  // Modal styles
  backgroundOverlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: -100,
    position: "absolute",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,

  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "50%",
  },
  confirmButton: {
    backgroundColor: "#810000",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#0b2b2f",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
