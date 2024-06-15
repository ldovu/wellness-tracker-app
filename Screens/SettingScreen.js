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


const SettingsScreen = () => {
  const userData = useUser();

  const [image, setImage] = useState("");
  const actionSheetRef = useRef();


  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Handle function for adding a photo:
  //    it shows a dropdown menu and allow the user to pick an image from the gallery
  //    or take a photo with the camera
  const handleActionSheet = (index) => {
    if (index === 0) {
      pickImage();
    } else if (index === 1) {
      takePhoto();
    }
  };

  // Function for picking an image from the gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function for taking a photo with the camera
  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Function for removing the uploaded image image
  const removeImage = () => {
    setImage("");
  };
  console.log("User data in Diet:", userData);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text>Diet Screen</Text>
        
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => actionSheetRef.current.show()}
            style={styles.iconButton}
          >
            <Icon name="add-a-photo" size={40} color="#0b2b2f" />
          </TouchableOpacity>
          {image ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity onPress={removeImage}>
                <Icon name="delete" size={30} color="red" />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Text>User Data: {userData.username}</Text>
        <ActionSheet
          ref={actionSheetRef}
          title={"Choose an option"}
          options={["Pick an image from camera roll", "Take a photo", "Cancel"]}
          cancelButtonIndex={2}
          onPress={(index) => handleActionSheet(index)}
        />
        
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

export default SettingsScreen;
