import React from "react";
import { View } from "react-native";
import { Tabs, TabScreen } from "react-native-paper-tabs";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ContactsTab from "../components/ContactTab";
import GroupTab from "../components/GroupsTab";
import firebase from "firebase";
import { AUTH, FIRESTORE } from "../server/db";
import { IContact, IGroup } from "../utils";

const Stack = createStackNavigator();

const GroupView: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [user, setUser] = React.useState<firebase.User>();
  const [groups, setGroups] = React.useState<IGroup[]>([]);
  const [contacts, setContacts] = React.useState<IContact[]>([]);

  /**
   * GETTING USER FROM FIREBASE AUTH
   */
  React.useEffect(() => AUTH.onAuthStateChanged(setUser));

  /**
   * GETTING GROUPS FROM FIRESTORE
   */
  React.useEffect(() => {
    if (user)
      return FIRESTORE.collection("groups")
        .where("uid", "==", user.uid)
        .onSnapshot(async (snap) => {
          const _groups = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));

          setGroups(_groups);
          await AsyncStorage.setItem(
            "@groups",
            JSON.stringify(_groups.map(({ createdAt, ...data }) => data))
          );
        });
  }, [user]);

  /**
   * GETTING CONTACTS FROM FIRESTORE
   */
  React.useEffect(() => {
    if (user)
      return FIRESTORE.collection("contacts")
        .where("uid", "==", user.uid)
        .onSnapshot(async (snap) => {
          const _contacts = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));

          setContacts(_contacts);

          await AsyncStorage.setItem(
            "@contacts",
            JSON.stringify(_contacts.map(({ createdAt, ...data }) => data))
          );
        });
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <Tabs defaultIndex={0} style={{ elevation: 0 }}>
        <TabScreen label="Groupes" icon="account-group">
          <GroupTab
            navigation={navigation}
            groups={groups}
            contacts={contacts}
          />
        </TabScreen>
        <TabScreen label="Contacts" icon="contacts">
          <ContactsTab
            navigation={navigation}
            user={user}
            contacts={contacts}
          />
        </TabScreen>
      </Tabs>
    </View>
  );
};

const ContactsAndGroupsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="group"
        component={GroupView}
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR },
          headerTitleStyle: { color: "white" },
          title: "Clientelle",
        }}
      />
    </Stack.Navigator>
  );
};

export default ContactsAndGroupsScreen;
