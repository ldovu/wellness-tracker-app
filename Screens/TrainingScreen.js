import React, { useEffect, useState, useRef, useCallback } from "react";
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
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import { useUser } from "./UserContext";
import { getTrainings } from "../Data";
import ActionSheet from "react-native-actionsheet";

const TrainingScreen = () => {
  const navigation = useNavigation();
  const { userData } = useUser();
  const [trainings, setTrainings] = useState([]);

  const handleAddTrainingPress = () => {
    navigation.navigate("AddTraining");
  };

  // console.log("User data in Training:", userData.userData);
  console.log("U:", userData);

  const fetchTrainings = async () => {
    try {
      const storedTrainings = await getTrainings();
      if (Array.isArray(storedTrainings)) {
        const userTrainings = storedTrainings.filter(
          (training) => training.userTraining === userData.username
        );
        // console.log("User trainings:", userTrainings);
        setTrainings(userTrainings);
      } else {
        setTrainings([]);
      }
    } catch (error) {
      console.error("Error fetching trainings", error);
    }
  };

  // Each time the focus is one the screen the view is updated
  useFocusEffect(
    useCallback(() => {
      fetchTrainings();
    }, [])
  );

  const renderTrainings = () => {
    const groupedTrainings = trainings.reduce((acc, training) => {
      const date = training.stringDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(training);
      return acc;
    }, {});

    const sortedTrainings = Object.keys(groupedTrainings).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return sortedTrainings.map((date) => {
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
            </View>
          ))}
        </View>
      );
    });
  };

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
});

export default TrainingScreen;
