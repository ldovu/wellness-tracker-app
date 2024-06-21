import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * This file defines all the function that are related to the storage of the data.
 * The data persistency is managed by the AsyncStorage API.
 */

// Constants that define the keys for the storage
const Users_KEY = "@users";
const Activities_KEY = "@activities";
const Meals_KEY = "@meals";


// Get a single user by username
export const getUser = async (username) => {
  try {
    const jsonValue = await AsyncStorage.getItem(username + Users_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.log("Error retrieving user:", error);
    return null;
  }
};

// Update a user by taking the username and the updated attributes
export const updateUser = async (username, updatedUserAttributes) => {
  try {
    const user = await getUser(username);
    if (user) {
      const updatedUser = { ...user, ...updatedUserAttributes };
      await saveUser(username, updatedUser);
    } else {
      console.log(`User ${username} not found.`);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// Get all users registered in the application
export const getUsers = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter((key) => key.endsWith(Users_KEY));
    const users = [];
    for (let key of userKeys) {
      const user = await getUser(key.replace(Users_KEY, ""));
      if (user) {
        users.push(user);
      }
    }
    return users;
  } catch (error) {
    console.log("Error retrieving users:", error);
    return [];
  }
};

// Save a single user by username
export const saveUser = async (username, user) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(username + Users_KEY, jsonValue);
  } catch (error) {
    console.log("Error saving user:", error);
  }
};

// Add a new user
export const addUser = async (user) => {
  try {
    const existingUser = await getUser(user.username);
    if (existingUser) {
      throw new Error("User already exists");
    }
    await saveUser(user.username, user);
  } catch (error) {
    console.log("Error adding user:", error);
  }
};

// Save meal with the proper key
export const saveMeal = async (meal) => {
  try {
    // Fetch the existing meals from storage
    const existingMeals = await AsyncStorage.getItem(Meals_KEY);
    console.log("Existing meals:", existingMeals);
    console.log("Typeof ", typeof existingMeals);

    // Initialize mealsArray
    let mealsArray = [];

    if (existingMeals !== null) {
      // Parse the existing meals to an array, with error handling
      try {
        mealsArray = JSON.parse(existingMeals);
      } catch (error) {
        console.error("Error parsing existing meals: ", error);
        mealsArray = [];
      }
    }

    // Check if mealsArray is indeed an array
    if (!Array.isArray(mealsArray)) {
      mealsArray = [];
    }

    // Add the new meal to the array
    mealsArray.push(meal);

    // Convert the updated array back to a string
    const updatedMeals = JSON.stringify(mealsArray);

    // Save the updated array back to storage
    await AsyncStorage.setItem(Meals_KEY, updatedMeals);

    console.log("Meal saved successfully!");
  } catch (error) {
    console.error("Error saving meal: ", error);
  }
};

// Get all the meals fetching them with the proper key
export const getMeals = async () => {
  try {
    // Fetch the existing meals from storage
    const existingMeals = await AsyncStorage.getItem(Meals_KEY);

    // Parse and return the meals, or return an empty array if null
    return existingMeals ? JSON.parse(existingMeals) : [];
  } catch (error) {
    console.error("Error fetching meals: ", error);
    return [];
  }
};

// Save training with the proper key
export const saveTraining = async (training) => {
  try {
    const existingTrainings = await AsyncStorage.getItem(Activities_KEY);
    let trainingsArray = [];

    if (existingTrainings !== null) {
      try {
        trainingsArray = JSON.parse(existingTrainings);
      } catch (error) {
        console.error("Error parsing existing trainings: ", error);
        trainingsArray = [];
      }
    }
    if (!Array.isArray(trainingsArray)) {
      trainingsArray = [];
    }
    trainingsArray.push(training);
    const updatedTrainings = JSON.stringify(trainingsArray);
    await AsyncStorage.setItem(Activities_KEY, updatedTrainings);
    console.log("Training saved successfully!");
  } catch (error) {
    console.error("Error saving training: ", error);
  }
};

// Get all the trainings fetching them with the proper key
export const getTrainings = async () => {
  try {
    const existingTrainings = await AsyncStorage.getItem(Activities_KEY);
    return existingTrainings ? JSON.parse(existingTrainings) : [];
  } catch (error) {
    console.error("Error fetching trainings: ", error);
    return [];
  }
};

// Simple function for outputting console log of the state of the user who is trying to log out 
export const logoutUser = async () => {
  try {
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Error logging out user: ", error);
  }
};




// export const deleteLastUser = async () => {
//   try {
//     // Retrieve existing users
//     const users = await getUsers();

//     // Check if there are users to delete
//     if (users.length === 0) {
//       console.log("No users found to delete.");
//       return false;
//     }

//     // Remove the last user from the array
//     const removedUser = users.pop();

//     // Remove the user from AsyncStorage
//     await AsyncStorage.removeItem(`${removedUser.username}${Users_KEY}`);

//     console.log(`User ${removedUser.username} deleted successfully.`);
//     return true;
//   } catch (error) {
//     console.error("Error deleting the last user: ", error);
//     return false;
//   }
// };
// export const deleteTraining = async () => {
//   try {
//     // Retrieve existing users
//     const users = await getTrainings();

//     // Check if there are users to delete
//     if (users.length === 0) {
//       console.log("No training found to delete.");
//       return false;
//     }

//     // Remove the last user from the array
//     const removedUser = users.pop();

//     // Remove the user from AsyncStorage
//     await AsyncStorage.removeItem(`${Activities_KEY}`);

//     console.log(`Training deleted successfully.`);
//     return true;
//   } catch (error) {
//     console.error("Error deleting the last user: ", error);
//     return false;
//   }
// };
