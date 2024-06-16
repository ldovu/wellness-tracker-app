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
import { getMeals } from "../Data";
import ActionSheet from "react-native-actionsheet";

const categoryOrder = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
  Snack: 4,
};

const DietScreen = () => {
  const navigation = useNavigation();
  const userData = useUser();
  const [meals, setMeals] = useState([]);
  const actionSheetRef = useRef();

  const handleAddMealPress = () => {
    navigation.navigate("AddMeal");
  };

  // Hook: first parameter -> function that represents the "effect"
  //       second parameter -> optional array of dependencies:
  //                          - react rerun the effect only when dependencies has changed
  //                          - if dependencies array is omitted, the effects runs after every render

  const fetchMeals = async () => {
    try {
      const storedMeals = await getMeals();
      if (Array.isArray(storedMeals)) {
        const userMeals = storedMeals.filter(
          (meal) => meal.userMeal === userData.username
        );
        console.log("User meals:", userMeals);
        setMeals(userMeals);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
      setMeals([]);
    }
  };
  //
  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [userData.username])
  );

  const renderMeals = () => {
    const groupedMeals = meals.reduce((acc, meal) => {
      const date = meal.stringDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {});

    // Sort the dates in ascending order from the furthest to the nearest
    const sortedDates = Object.keys(groupedMeals).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return sortedDates.map((date) => {
      // Grouped the meals by date
      const mealsForDate = groupedMeals[date];

      // Sort the meals by category order depending on the categoryOrder object
      const sortedMeals = mealsForDate.sort((a, b) => {
        const orderA = categoryOrder[a.category] ?? Number.MAX_SAFE_INTEGER;
        const orderB = categoryOrder[b.category] ?? Number.MAX_SAFE_INTEGER;
        // console.log(`confronto: ${a.category} (${orderA}) - ${b.category} (${orderB})`);
        return orderA - orderB;
      });
      return (
        <View key={date} style={styles.mealGroup}>
          <Text style={styles.dateText}>{date}</Text>
          {sortedMeals.map((meal, index) => (
            <View key={index} style={styles.mealItem}>
              <View style={styles.mealDetails}>
                <Text style={styles.mealCategory}>{meal.category}</Text>
                <Text style={styles.mealText}>{meal.mealDetails}</Text>
                <Text style={styles.mealText}>{meal.calories} kcal</Text>
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
          {renderMeals()}
        </ScrollView>
        <TouchableOpacity style={styles.button} onPress={handleAddMealPress}>
          <Text style={styles.buttonText}> + Add New Meal</Text>
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

  // --------------------------------

  mealGroup: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealDetails: {
    flex: 1,
  },
  mealCategory: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mealText: {
    fontSize: 16,
  },
  iconButton: {
    marginTop: 5,
    marginRight: 5,
  },
});

export default DietScreen;
