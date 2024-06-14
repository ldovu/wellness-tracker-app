// This file is used for providing a context for passing the user data 
// from Tab Navigator to Tab Screens (TrainingScreen, DietScreen, SettingScreen)


import React, { createContext, useContext } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children, value }) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};


