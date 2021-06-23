import * as React from "react";
import { View, SafeAreaView } from "react-native";
import { TextInput, Button, Appbar, Menu, Divider } from "react-native-paper";
import {
  BACKGROUND_COLOR,
  GroupScreenStatus,
  HARD_SHADOW,
  IContact,
} from "../utils";
import { StackScreenProps } from "@react-navigation/stack";
import Atoz from "../libraries/Atoz";
import { AUTH, FIREBASE_APP, FIRESTORE } from "../server/db";

const CRUDGroupScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
  route,
}) => {
  const [contacts, setContacts] = React.useState<IContact[]>([]);
  const [selectedContacts, setSelectedContacts] = React.useState<IContact[]>(
    route.params ? route.params.initialSelectedContacts || [] : []
  );
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [groupName, setGroupName] = React.useState<string>(
    route.params ? route.params.name || "" : ""
  );
  const [status, setStatus] = React.useState<GroupScreenStatus>(
    route.params
      ? route.params.status || GroupScreenStatus.VIEW
      : GroupScreenStatus.VIEW
  );

  console.log(route.params);

  React.useEffect(() => {
    switch (status) {
      case GroupScreenStatus.UPDATE:
      case GroupScreenStatus.CREATE:
      case GroupScreenStatus.VIEW:
      default:
        setContacts(route.params.contacts || []);
        setSelectedContacts(route.params.initialSelectedContacts || []);
        break;
    }
  }, [status]);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const createAndUpdateHandler = async () => {
    setLoading(true);
    try {
      if (groupName.trim().length < 5)
        throw { message: "Nom du groupe trop court" };

      if (selectedContacts.length < 2)
        throw { message: "Vous devez selectionner au moins 2 contacts" };

      const user = AUTH.currentUser;

      if (status === GroupScreenStatus.CREATE) {
        await FIRESTORE.collection("groups").add({
          createdAt: FIREBASE_APP.firestore.Timestamp.now(),
          uid: user.uid,
          name: groupName,
          contacts: selectedContacts.map((e) => e.id),
          latestContacts: selectedContacts.filter((e, i) => i < 3),
          contactsLength: selectedContacts.length,
        });
        alert("Groupe cree");
      } else {
        await FIRESTORE.collection("groups")
          .doc(route.params.id)
          .update({
            name: groupName,
            contacts: selectedContacts.map((e) => e.id),
            latestContacts: selectedContacts.filter((e, i) => i < 3),
            contactsLength: selectedContacts.length,
          });
        alert("Groupe mis a jour");
      }

      navigation.goBack();
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <Appbar.Header style={{ overflow: "visible", zIndex: 100 }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={
            status === GroupScreenStatus.VIEW ||
            status === GroupScreenStatus.UPDATE
              ? route.params.name
              : "Creer un groupe"
          }
          subtitle={
            selectedContacts.length +
            " Contacts " +
            (status === GroupScreenStatus.VIEW ? "" : "Selectionne(s)")
          }
        />

        {status === GroupScreenStatus.VIEW && (
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                color="white"
                onPress={openMenu}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setStatus(GroupScreenStatus.UPDATE);
              }}
              title="Modifier"
            />
            <Menu.Item
              onPress={async () => {
                await FIRESTORE.collection("groups")
                  .doc(route.params.id)
                  .delete();

                navigation.goBack();
              }}
              title="Suprimer"
            />
          </Menu>
        )}
      </Appbar.Header>
      <SafeAreaView style={{ flex: 1 }}>
        {status !== GroupScreenStatus.VIEW && (
          <>
            <TextInput
              label="Nom du groupe"
              placeholder="Ex: GROUPE A"
              style={{ ...HARD_SHADOW, backgroundColor: "white", margin: 20 }}
              dense
              value={groupName}
              onChangeText={setGroupName}
            />
            <Divider />
          </>
        )}
        <View style={{ flex: 1 }}>
          <Atoz
            showSearch
            isSelectable={status !== GroupScreenStatus.VIEW}
            onSelectionChanged={setSelectedContacts}
            initialSelectedContacts={selectedContacts}
            data={(status === GroupScreenStatus.VIEW
              ? selectedContacts
              : contacts
            ).map((contact) => ({
              ...contact,
              key: contact.firstName + " " + contact.lastName,
            }))}
          />
        </View>

        {status !== GroupScreenStatus.VIEW && (
          <View
            style={{
              ...(loading ? {} : HARD_SHADOW),
              marginTop: 10,
              marginLeft: 20,
              marginRight: 20,
              marginBottom: 20,
            }}
          >
            <Button
              loading={loading}
              disabled={loading}
              mode="contained"
              style={{ borderRadius: 0, elevation: 0 }}
              contentStyle={{ padding: 5 }}
              onPress={createAndUpdateHandler}
            >
              {loading
                ? "Patientez..."
                : status === GroupScreenStatus.CREATE
                ? "Creer"
                : "Sauvegarder"}
            </Button>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default CRUDGroupScreen;
