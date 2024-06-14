import React from "react";
import { View, Text } from "react-native";

const TrainingScreen = () => {
  const userData = useUser();
  console.log("User data in Diet:", userData);
  return (
    <View>
      <Text>Training Screen</Text>
    </View>
  );
};

export default TrainingScreen;
