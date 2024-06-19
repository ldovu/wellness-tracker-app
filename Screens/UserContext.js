// This file is used for providing a context for passing the user data 
// from Tab Navigator to Tab Screens (TrainingScreen, DietScreen, SettingScreen)

import React, { createContext, useContext, useState } from 'react';

// // Create the UserContext
// const UserContext = createContext();

// // UserProvider component to provide the context value
// export const UserProvider = ({ children, value }) => {
//   const [username, setUsername] = useState(value.username || '');

//   return (
//     <UserContext.Provider value={{ username, setUsername }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to use the UserContext
// export const useUser = () => useContext(UserContext);

const UserContext = createContext();

// UserProvider component to provide the context value
export const UserProvider = ({ children, value }) => {
  const [userData, setUserData] = useState(value || {});

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

