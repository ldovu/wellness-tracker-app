import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

/**
 * SplashScreen models the screen that appears when the app is launched.
 * It displays the app's logo and navigates to the Login screen after 0.5 seconds.
 */

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 500);

    return () => clearTimeout(timer); // clear timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../Images/logoapp.png")} style={styles.logo} />
    </View>
  );
}

// Styles for the SplashScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f8eb",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
});
