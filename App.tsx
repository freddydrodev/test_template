import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import * as React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import VerifyNumberScreen from "./screens/VerifyNumberScreen";
import RegisterDetailsScreen from "./screens/RegisterDetailsScreen";
import SelectActivitiesScreen from "./screens/SelectActivitiesScreen";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "./utils/colors";
import PrivateFlow from "./screens/PrivateFlow";
import CRUDGroupScreen from "./screens/CRUDGroupScreen";
import CreateSenderID from "./screens/CreateSenderID";
import CUContact from "./screens/CUContact";
import UpdatePersonalDetails from "./screens/UpdatePersonalDetails";
import UpdateCompanyDetails from "./screens/UpdateCompanyDetails";
import SelectContactScreen from "./screens/SelectContactScreen";
import SendMsgScreen from "./screens/SendMsgScreen";
import SelectGroupScreen from "./screens/SelectGroupScreen";
import { AUTH, FIRESTORE } from "./server/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "./utils";

// TODO: LAZY_LOAD FONT @EXPO/VECTOR-ICONS OR Use custom ICON

// TODO MAKE ATOZ SEARCH CONVERT STRING TO LOWER CASE

// TODO ATIZ ADD FILTER

// TODO ATOZ DISABLE SELECT ALL ON SEARCH

//TODO ATOZ ADD RIGHT LIST AND MAKE IT INTERACT WITH THE MAIN ON

enum AuthStatus {
  "NOT_AUTHENTICATED",
  "AUTHENTICATED_WITHOUT_DATA",
  "AUTHENTICATED_WITHOUT_ACTIVITIES",
  "AUTHENTICATED",
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: PRIMARY_COLOR,
    accent: "yellow",
  },
};

const Stack = createStackNavigator();

export default function App() {
  const [status, setStatus] = React.useState<AuthStatus>(
    AuthStatus.NOT_AUTHENTICATED
  );

  React.useEffect(() =>
    AUTH.onAuthStateChanged((_) => {
      if (_) {
        FIRESTORE.collection("companies")
          .doc(_.uid)
          .onSnapshot(async (userResult) => {
            if (userResult.exists) {
              const user: IUser = {
                uid: userResult.id,
                ...(userResult.data() as any),
              };

              await AsyncStorage.setItem("@user", JSON.stringify(user));

              if (
                !user["lastName"] ||
                !user["firstName"] ||
                !user["companyName"]
              ) {
                return setStatus(AuthStatus.AUTHENTICATED_WITHOUT_DATA);
              }

              // if (!user["activities"])
              //   return setStatus(AuthStatus.AUTHENTICATED_WITHOUT_ACTIVITIES);

              setStatus(AuthStatus.AUTHENTICATED);
            } else {
              setStatus(AuthStatus.NOT_AUTHENTICATED);
            }
          });
      } else {
        setStatus(AuthStatus.NOT_AUTHENTICATED);
      }
    })
  );

  return (
    <ActionSheetProvider>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <Stack.Navigator>
            {status === AuthStatus.NOT_AUTHENTICATED && (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="welcome"
                  component={WelcomeScreen}
                />

                <Stack.Screen
                  options={{
                    headerStyle: { backgroundColor: BACKGROUND_COLOR },
                  }}
                  name="login"
                  component={LoginScreen}
                />
                <Stack.Screen
                  options={{
                    headerStyle: { backgroundColor: BACKGROUND_COLOR },
                    headerBackTitleStyle: { color: PRIMARY_COLOR },
                  }}
                  name="verifyNumber"
                  component={VerifyNumberScreen}
                />
              </>
            )}
            {(status === AuthStatus.AUTHENTICATED_WITHOUT_DATA ||
              status === AuthStatus.NOT_AUTHENTICATED) && (
              <Stack.Screen
                options={{
                  headerStyle: { backgroundColor: BACKGROUND_COLOR },
                  headerBackTitleStyle: { color: PRIMARY_COLOR },
                }}
                name="registerDetails"
                component={RegisterDetailsScreen}
              />
            )}
            {/* {(status === AuthStatus.AUTHENTICATED_WITHOUT_ACTIVITIES ||
              status === AuthStatus.AUTHENTICATED_WITHOUT_DATA ||
              status === AuthStatus.NOT_AUTHENTICATED) && (
              <Stack.Screen
                options={{
                  headerStyle: { backgroundColor: BACKGROUND_COLOR },
                  headerBackTitleStyle: { color: PRIMARY_COLOR },
                }}
                name="selectActivities"
                component={SelectActivitiesScreen}
              />
            )} */}
            {(status === AuthStatus.AUTHENTICATED_WITHOUT_DATA ||
              status === AuthStatus.AUTHENTICATED) && (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="private"
                  component={PrivateFlow}
                />
                <Stack.Screen
                  name="CRUDGroup"
                  options={{
                    headerShown: false,
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Groupe",
                  }}
                  component={CRUDGroupScreen}
                />
                <Stack.Screen
                  name="createSenderID"
                  options={{
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Creer un SenderID (label)",
                  }}
                  component={CreateSenderID}
                />
                <Stack.Screen
                  name="createContact"
                  options={{
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Ajouter un contact",
                  }}
                  component={CUContact}
                />
                <Stack.Screen
                  name="updatePersonalDetails"
                  options={{
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Details personnel",
                  }}
                  component={UpdatePersonalDetails}
                />
                <Stack.Screen
                  name="updateCompanyDetails"
                  options={{
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Details de la compagnie",
                  }}
                  component={UpdateCompanyDetails}
                />
                <Stack.Screen
                  name="selectContact"
                  options={{
                    headerShown: false,
                  }}
                  component={SelectContactScreen}
                />
                <Stack.Screen
                  name="selectGroup"
                  options={{
                    headerShown: false,
                  }}
                  component={SelectGroupScreen}
                />
                <Stack.Screen
                  name="sendMessage"
                  options={{
                    headerStyle: {
                      backgroundColor: PRIMARY_COLOR,
                      borderWidth: 0,
                    },
                    headerTitleStyle: {
                      fontSize: 14,
                      letterSpacing: 1,
                      color: "white",
                    },
                    title: "Envoyer un message",
                  }}
                  component={SendMsgScreen}
                />
              </>
            )}
          </Stack.Navigator>
          <StatusBar style="auto" />
        </PaperProvider>
      </NavigationContainer>
    </ActionSheetProvider>
  );
}
