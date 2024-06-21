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
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useUser } from "./UserContext";
import { getMeals } from "../Data";

// Variable that defines the order of the categories
const categoryOrder = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
  Snack: 4,
};

/**
 * DietScreen models the screen for displaying the user's meals.
 * The user can see the details of the meal he/she has added.
 * The user can add a new meal by pressing the button "Add New Meal".
 */

const DietScreen = () => {
  const { userData } = useUser();
  const [meals, setMeals] = useState([]);

  const navigation = useNavigation();

  const handleAddMealPress = () => {
    navigation.navigate("AddMeal");
  };

  /**
   * Asynchronous function that fetches the meals from the storage with "getMeals"
   * and filters them based on the current logged in user.
   * The meals are then set to the state variable "meals".
   */
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

  // Hook that fetches the meals whenever the screen is focused
  // The presence of the dependecy userData.username ensures that any change in the username triggers a re-fetch
  useFocusEffect(
    useCallback(() => {
      fetchMeals();
    }, [userData.username])
  );

  // Function that renders a general training in the screen
  const renderMeals = () => {
    
    // Group meals by their date
    // e.g. groupedMeals = { "01-06-2024: [meal1, meal2], "02-06-2024": [meal3], ...}
    //                       where meal1, meal2, meal3 are objects representing meals
    const groupedMeals = meals.reduce((acc, meal) => {
      const date = meal.stringDate;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(meal);
      return acc;
    }, {});

    // Sort the dates in ascending order
    const sortedDates = Object.keys(groupedMeals).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Render the trainings
    return sortedDates.map((date) => {
      // Grouped the meals by date
      const mealsForDate = groupedMeals[date];

      // Sort the meals by category order depending on the categoryOrder variable
      const sortedMeals = mealsForDate.sort((a, b) => {
        const orderA = categoryOrder[a.category] ?? Number.MAX_SAFE_INTEGER;
        const orderB = categoryOrder[b.category] ?? Number.MAX_SAFE_INTEGER;
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
              {meal.image && (
                <Image source={{ uri: meal.image }} style={styles.mealImage} />
              )}
            </View>
          ))}
        </View>
      );
    });
  };

  // Renders the main screen recalling the renderMeals function
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


// Styles for the DietScreen
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
  addButton: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginBottom: 20,
  },

  title: {
    fontSize: 54,
    fontWeight: "bold",
    marginBottom: 20,
  },

  mealImage: {
    width: 100,
    height: 100,
    borderRadius: 3,
    marginRight: 4,
  },

  // --------------------------------

  textAddImage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007BFF",
  },
  addImageText: {
    color: "#007BFF",
    marginTop: 8,
  },
  removeImageText: {
    color: "#FF0000",
    marginTop: 8,
  },
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
