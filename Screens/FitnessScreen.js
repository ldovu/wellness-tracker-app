import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import {
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useUser } from "./UserContext";
import { getTrainings } from "../Data";

/**
 * FitnessScreen models the screen for displaying the user's trainings.
 * The user can see the details of the training he/she has added.
 * The user can add a new training by pressing the button "Add New Training".
 */

const FitnessScreen = () => {
  const { userData } = useUser();
  const [trainings, setTrainings] = useState([]);

  const navigation = useNavigation();

  const handleAddTrainingPress = () => {
    navigation.navigate("AddTraining");
  };

  /**
   * Asynchronous function that fetches the trainings from the storage with "getTrainings"
   * and filters them based on the current logged in user.
   * The trainings are then set to the state variable "trainings".
   */
  const fetchTrainings = async () => {
    try {
      const storedTrainings = await getTrainings();
      if (Array.isArray(storedTrainings)) {
        const userTrainings = storedTrainings.filter(
          (training) => training.userTraining === userData.username
        );
        setTrainings(userTrainings);
      } else {
        setTrainings([]);
      }
    } catch (error) {
      console.error("Error fetching trainings", error);
    }
  };

  // Hook that fetches the trainings whenever the screen is focused
  // The presence of the dependecy userData.username ensures that any change in the username triggers a re-fetch
  useFocusEffect(
    useCallback(() => {
      fetchTrainings();
    }, [userData.username])
  );

  // Function that renders a general training in the screen
  const renderTrainings = () => {
    // Group trainings by their date
    // e.g. groupedTrainings = { "01-06-2024: [training1, training2], "02-06-2024": [training3], ...}
    //                       where training1, training2, training3 are objects representing trainings
    const groupedTrainings = trainings.reduce((acc, training) => {
      const date = training.stringDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(training);
      return acc;
    }, {});

    // Sort the dates in ascending order
    const sortedTrainings = Object.keys(groupedTrainings).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Render the trainings
    return sortedTrainings.map((date) => {
      // Group trainings by their date
      const trainingsForDate = groupedTrainings[date];
      return (
        <View key={date} style={styles.trainingGroup}>
          <Text style={styles.dateText}>{date}</Text>
          {trainingsForDate.map((training, index) => (
            <View key={index} style={styles.trainingItem}>
              <View style={styles.trainingDetails}>
                <Text style={styles.trainingSports}>{training.sport}</Text>
                <Text style={styles.trainingText}>
                  {training.hours}:{training.minutes}:00
                </Text>
                <Text style={styles.trainingText}>
                  {training.burntCalories} kcal
                </Text>
                <Text style={styles.trainingText}>{training.description}</Text>
              </View>
              {training.image && (
                <Image
                  source={{ uri: training.image }}
                  style={styles.trainingImage}
                />
              )}
            </View>
          ))}
        </View>
      );
    });
  };

  // Renders the main screen recalling the renderTrainings function
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {renderTrainings()}
        </ScrollView>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddTrainingPress}
        >
          <Text style={styles.buttonText}> + Add New Training</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles for the FitnessScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#f9f8eb",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    marginTop: 20,
  },

  image: {
    width: 100,
    height: 100,
  },
  // Button positioned at the bottom of the screen as it is more user-friendly
  button: {
    position: "absolute",
    bottom: 10,
    width: "60%",
    height: 45,
    backgroundColor: "#0b2b2f",
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

  buttonContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 20,
  },

  trainingGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  trainingItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  trainingDetails: {
    flex: 1,
  },
  trainingSports: {
    fontSize: 16,
    fontWeight: "bold",
  },
  trainingText: {
    fontSize: 16,
  },
  trainingImage: {
    width: 100,
    height: 100,
    borderRadius: 3,
    marginRight: 4,
  },
});

export default FitnessScreen;
