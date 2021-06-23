import * as React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./MessageFlow";
import { PRIMARY_COLOR } from "../utils/colors";
import ContactsAndGroupsScreen from "./ContactsAndGroupsScreen";
import ShopScreen from "./ShopScreen";
import CompteScreen from "./CompteScreen";
import Feather from "@expo/vector-icons/Feather";

const Tab = createBottomTabNavigator();

const PrivateFlow = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Tab.Navigator
        sceneContainerStyle={{ flex: 1 }}
        tabBarOptions={{
          safeAreaInsets: { bottom: 0 },
          style: { height: 85 },
          tabStyle: {
            backgroundColor: "black",
            paddingBottom: 25,
            paddingTop: 5,
          },
          activeTintColor: PRIMARY_COLOR,
          inactiveTintColor: "white",
          labelStyle: {
            fontSize: 11,
            lineHeight: 11,
            fontWeight: "700",
            letterSpacing: 1,
            textTransform: "uppercase",
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="home"
                color={focused ? PRIMARY_COLOR : "white"}
                size={22}
              />
            ),
            title: "Accueil",
          }}
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="users"
                color={focused ? PRIMARY_COLOR : "white"}
                size={22}
              />
            ),
            title: "Clientele",
          }}
          name="contactsAndGroups"
          component={ContactsAndGroupsScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="shopping-bag"
                color={focused ? PRIMARY_COLOR : "white"}
                size={22}
              />
            ),
            title: "Boutique",
          }}
          name="shop"
          component={ShopScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Feather
                name="settings"
                color={focused ? PRIMARY_COLOR : "white"}
                size={22}
              />
            ),
            title: "Parametre",
          }}
          name="account"
          component={CompteScreen}
        />
      </Tab.Navigator>
    </View>
  );
};

export default PrivateFlow;
