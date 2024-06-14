import React from "react";
import { View, Text } from "react-native";

const SettingsScreen = () => {
  const userData = useUser();
  console.log("User data in Diet:", userData);
  return (
    <View>
      <Text>Settings Screen</Text>
    </View>
  );
};

export default SettingsScreen;
