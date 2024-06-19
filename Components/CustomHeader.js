import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { logoutUser } from "../Data";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

const CustomHeader = ({ title, username }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logoutUser();
    navigation.reset({
      index: 0,
      actions: [navigation.navigate("Login")],
    });
    console.log("User logged out");
    setModalVisible(false);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    marginRight: 200,
  },
  avatarContainer: {
    marginLeft: "auto",
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  menuOption: {
    padding: 10,
    fontSize: 16,
    color: "#0b2b2f",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  

});

export default CustomHeader;
