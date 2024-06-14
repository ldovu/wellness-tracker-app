import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login"); // navigate to "Auth" instead of "Login"
    }, 500); // 2000= after 2 seconds

    return () => clearTimeout(timer); // clear timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../Images/logoapp.png")} style={styles.logo} />
    </View>
  );
}

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
