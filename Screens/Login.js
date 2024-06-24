import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "../Data";
import Icon from "react-native-vector-icons/Ionicons";

/**
 * LoginScreen models the screen for the user login.
 * The user can input the username and password, with the possibility to show/hide the password.
 * The user can navigate to the SignupScreen if he/she is not registered.
 */
const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle the login of the user by checking the username and password
  const handleLogin = async () => {
    if (!username) {
      alert("Username is required");
      return;
    }
    if (!password) {
      alert("Password is required");
      return;
    }

    try {
      const storedUsername = await getUser(username);
      console.log("User found: ", username);

      // Check if the password is correct
      if (storedUsername.password === password) {
        console.log("Stored user:", storedUsername);

        // Navigate to the Home screen and pass the user object as a parameter
        navigation.navigate("Home", { user: storedUsername });
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("User not found");
    }
  };

  // Render the login screen
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
          <View style={styles.container}>
            <Image
              source={require("../Images/logoapp.png")}
              style={styles.logo}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.title}>Login</Text>
              <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                value={username}
                onChangeText={setUsername}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.inputPassword}
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  <Icon
                    name={isPasswordVisible ? "eye" : "eye-off"}
                    size={24}
                    color="gray"
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Text style={styles.text}>New user?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                  <Text style={styles.linkText}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
            <StatusBar style="auto" />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Styles for the LoginScreen
const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#f9f8eb",
  },
  content: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#f9f8eb",
    marginBottom: 60,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f8eb",
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  loginContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 20,
    justifyContent: "center",
  },
  button: {
    width: "80%",
    height: 45,
    backgroundColor: "#0b2b2f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#f9f8eb",
    fontSize: 24,
    fontWeight: "bold",
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    marginLeft: 5,
    fontSize: 20,
  },
  text: {
    fontSize: 20,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    fontSize: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 55,
  },

  inputPassword: {
    flex: 1,
    fontSize: 20,
  },
  icon: {
    marginRight: 10,
  },
});

export default LoginScreen;
