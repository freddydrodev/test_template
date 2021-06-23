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
import Atoz from "../libraries/Atoz";

const DB_CONTACTS = [
  {
    firstName: "Lillie-Mai Allen",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "lCUTs2",
  },
  {
    firstName: "Emmanuel Goldstein",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "TXdL0c",
  },
  {
    firstName: "Winston Smith",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "zqsiEw",
  },
  {
    firstName: "William Blazkowicz",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "psg2PM",
  },
  {
    firstName: "Gordon Comstock",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "1K6I18",
  },
  {
    firstName: "Philip Ravelston",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "NVHSkA",
  },
  {
    firstName: "Rosemary Waterlow",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "SaHqyG",
  },
  {
    firstName: "Julia Comstock",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "iaT1Ex",
  },
  {
    firstName: "Mihai Maldonado",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "OvMd5e",
  },
  {
    firstName: "Murtaza Molina",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "25zqAO",
  },
  {
    firstName: "Peter Petigrew",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "8cWuu3",
  },
];

const DB_SELECTED_CONTACT = [
  {
    firstName: "Lillie-Mai Allen",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "lCUTs2",
  },
  {
    firstName: "Gordon Comstock",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "1K6I18",
  },
  {
    firstName: "Julia Comstock",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "iaT1Ex",
  },
  {
    firstName: "Mihai Maldonado",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "OvMd5e",
  },
  {
    firstName: "Peter Petigrew",
    lastName: "",
    number: ["2250708517414"],
    avatar: "FC",
    id: "8cWuu3",
  },
];

const SelectGroupScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const contacts: IContact[] = DB_CONTACTS;
  const [selectedContacts, setSelectedContacts] =
    React.useState<IContact[]>(DB_SELECTED_CONTACT);

  // TODO ADJUST FOR GROUP
  console.log(selectedContacts);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <Appbar.Header style={{ overflow: "visible", zIndex: 100, elevation: 0 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Selectionnez les groupes" subtitle="4 Groupes" />
      </Appbar.Header>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Atoz
            showSearch
            isSelectable
            onSelectionChanged={setSelectedContacts}
            data={contacts.map((e) => ({
              key: e.id,
              value: e.firstName + " " + e.lastName,
            }))}
          />
        </View>

        <FAB
          label="Continuer"
          icon="chevron-right"
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: "black",
            borderRadius: 0,
            ...HARD_SHADOW,
            shadowColor: PRIMARY_COLOR,
            shadowOffset: { width: 5, height: 5 },
          }}
          onPress={() => {
            navigation.navigate("sendMessage");
          }}
        />
      </SafeAreaView>
    </View>
  );
};

export default SelectGroupScreen;
