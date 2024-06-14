import AsyncStorage from "@react-native-async-storage/async-storage";

const Users_KEY = "@users";
const Activities_KEY = "@activities";
const Meals_KEY = "@meals";

// AyncStorage permette di salvare stringhe nel database
// se volessi salvare un oggetto dovrei convertirlo in stringa

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


// Get all users
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
      throw new Error('User already exists');
    }
    await saveUser(user.username, user);
  } catch (error) {
    console.log("Error adding user:", error);
  }
};

// Get activities
export const getActivities = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(Activities_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.log("Error retrieving activities:", error);
    return [];
  }
};

// Save activities
export const saveActivities = async (activities) => {
  try {
    const jsonValue = JSON.stringify(activities);
    await AsyncStorage.setItem(Activities_KEY, jsonValue);
  } catch (error) {
    console.log("Error saving activities:", error);
  }
};

// Get meals
export const getMeals = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(Meals_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.log("Error retrieving meals:", error);
    return [];
  }
};

// Save meals
export const saveMeals = async (meals) => {
  try {
    const jsonValue = JSON.stringify(meals);
    await AsyncStorage.setItem(Meals_KEY, jsonValue);
  } catch (error) {
    console.log("Error saving meals:", error);
  }
};
