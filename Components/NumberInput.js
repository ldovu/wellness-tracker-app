import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";

const NumberInput = ({ value, onValueChange }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={styles.button}
      onPress={() => onValueChange(parseInt(value) - 1)}
    >
      <Text style={styles.textButton}>-</Text>
    </TouchableOpacity>
    <TextInput
      style={styles.input}
      value={value.toString()}
      keyboardType="numeric"
      onChangeText={(newValue) => {
        const numericValue = newValue.replace(/[^0-9]/g, "");
        onValueChange(numericValue);
      }}
    />
    <TouchableOpacity
      style={styles.button}
      onPress={() => onValueChange(parseInt(value) + 1)}
    >
      <Text style={styles.textButton}>+</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 40,
    height: 20,
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "center",
  },
  button: {
    width: 20,
    height: 20,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
  },
  textButton: {
    color: "#f9f8eb",
    fontSize: 12,
    fontWeight: "bold",
  },
});
export default NumberInput;
