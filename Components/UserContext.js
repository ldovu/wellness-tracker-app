import React, { createContext, useContext, useState } from 'react';

/** This file is used for providing the UserContext to its children 
 * so to Tab Screens: FitnessScreen, DietScreen, UserProfileScreen
 */ 

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

