import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FlatGrid } from "react-native-super-grid";
import { Avatar, Text, FAB } from "react-native-paper";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../utils/colors";
import { GroupScreenStatus, HARD_SHADOW, IContact, IGroup } from "../utils";

const GroupTab: React.FC<{
  navigation?: any;
  groups: IGroup[];
  contacts: IContact[];
}> = ({ navigation, groups = [], contacts = [] }) => {
  return (
    <React.Fragment>
      {groups.length === 0 ? (
        <Text
          style={{
            paddingHorizontal: 20,
            marginVertical: 40,
            fontWeight: "900",
            letterSpacing: 1,
            fontSize: 28,
            textAlign: "center",
            opacity: 0.3,
          }}
        >
          Vous n'avez creer aucun groupe
        </Text>
      ) : (
        <FlatGrid
          style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}
          spacing={20}
          itemDimension={130}
          data={groups}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                const initialSelectedContacts = [];

                contacts.forEach((e) => {
                  if (item.contacts.includes(e.id)) {
                    initialSelectedContacts.push(e);
                  }
                });

                navigation.navigate("CRUDGroup", {
                  id: item.id,
                  name: item.name,
                  contactsLength: item.contactsLength,
                  status: GroupScreenStatus.VIEW,
                  contacts,
                  initialSelectedContacts,
                });
              }}
              key={item.id}
            >
              <View
                style={{
                  backgroundColor:
                    (index % 4) % 3 === 0 ? PRIMARY_COLOR : "black",
                  padding: 20,
                  height: 150,
                  ...HARD_SHADOW,
                  shadowColor: (index % 4) % 3 === 0 ? "black" : PRIMARY_COLOR,
                  shadowOffset: { width: 8, height: 8 },
                }}
              >
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    color: "white",
                    fontSize: 15,
                    letterSpacing: 1,
                    fontWeight: "bold",
                    marginBottom: 10,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontWeight: "bold",
                    opacity: 0.6,
                    color: "white",
                  }}
                >
                  {item.contactsLength} Contacts
                </Text>

                <View style={{ flexDirection: "row" }}>
                  {(item.latestContacts || []).map((contact) => (
                    <Avatar.Text
                      label={contact.avatar}
                      key={contact.id}
                      size={25}
                      style={{
                        marginTop: 20,
                        marginRight: 10,
                        backgroundColor: "white",
                      }}
                      color={PRIMARY_COLOR}
                      labelStyle={{ fontSize: 11, fontWeight: "bold" }}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <FAB
        label="Creer groupe"
        icon="account-multiple-plus"
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "black",
          borderRadius: 0,
          ...HARD_SHADOW,
          shadowColor: PRIMARY_COLOR,
          shadowOffset: { width: 5, height: 5 },
        }}
        onPress={() =>
          navigation.navigate("CRUDGroup", {
            status: GroupScreenStatus.CREATE,
            contacts,
            initialSelectedContacts: [],
          })
        }
      />
    </React.Fragment>
  );
};

export default GroupTab;
