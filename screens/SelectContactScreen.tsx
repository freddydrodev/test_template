import * as React from "react";
import { View, SafeAreaView } from "react-native";
import { Appbar, FAB } from "react-native-paper";
import {
  BACKGROUND_COLOR,
  HARD_SHADOW,
  IContact,
  PRIMARY_COLOR,
} from "../utils";
import { StackScreenProps } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Atoz from "../libraries/Atoz";

const SelectContactScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
}) => {
  const [contacts, setContacts] = React.useState<IContact[]>([]);
  const [selectedContacts, setSelectedContacts] = React.useState<IContact[]>(
    []
  );

  const getLocalContacts = async () => {
    try {
      const _contacts = await AsyncStorage.getItem("@contacts");

      const _ = JSON.parse(_contacts);
      setContacts(_);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getLocalContacts();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <Appbar.Header style={{ overflow: "visible", zIndex: 100, elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Selectionnez les contacts"
          subtitle={`${selectedContacts.length} Contact(s)`}
        />
      </Appbar.Header>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Atoz
            onSelectionChanged={setSelectedContacts}
            showSearch
            isSelectable
            data={contacts.map((contact) => ({
              ...contact,
              key: contact.firstName + " " + contact.lastName,
            }))}
          />
        </View>

        <FAB
          disabled={selectedContacts.length === 0}
          label="Continuer"
          icon="chevron-right"
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: selectedContacts.length === 0 ? "#bbb" : "black",
            borderRadius: 0,
            ...(selectedContacts.length === 0 ? {} : HARD_SHADOW),
            shadowColor: PRIMARY_COLOR,
            shadowOffset: { width: 5, height: 5 },
          }}
          onPress={() => {
            navigation.navigate("sendMessage", {
              selectedContacts,
              type: "CONTACT",
            });
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SelectContactScreen;
