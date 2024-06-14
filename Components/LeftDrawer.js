import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Home from "../Screens/Home";


const Drawer = createDrawerNavigator();

export default function LeftDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Feed">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ drawerLabel: "Home" }}
      />
      
    </Drawer.Navigator>
  );
}
