import React from "react";
import { View, Text, StyleSheet } from "react-native";


/**
 * CustomHeader component models the header of the main screens.
 * The header displays:
 *   - The title of the screen
 *   - The user's avatar, represented by the first letter of their username
 */

const CustomHeader = ({ title, username }) => {
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

// Style definition for the header component
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
});

export default CustomHeader;
