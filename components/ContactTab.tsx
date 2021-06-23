import * as React from "react";
import { View } from "react-native";
import { Text, FAB, ActivityIndicator, Button } from "react-native-paper";
import { PRIMARY_COLOR } from "../utils/colors";
import * as Contacts from "expo-contacts";
import { HARD_SHADOW, IContact } from "../utils";
import firebase from "firebase";
import { FIREBASE_APP, FIRESTORE } from "../server/db";
import Atoz from "../libraries/Atoz";
import BottomSheet from "react-native-simple-bottom-sheet";
import { useActionSheet } from "@expo/react-native-action-sheet";

const ContactsTab: React.FC<{
  navigation?: any;
  user: firebase.User;
  contacts: IContact[];
}> = ({ navigation, user, contacts = [] }) => {
  const [contactOpen, setContactOpen] = React.useState(false);
  // const [contacts, setContacts] = React.useState<IContact[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const panelRef = React.useRef(null);
  const { showActionSheetWithOptions } = useActionSheet();

  return (
    <React.Fragment>
      {loading && (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 100,
            justifyContent: "center",
            alignItems: "center",
            padding: 40,
          }}
        >
          <ActivityIndicator size="large" />
          <Text
            style={{
              fontSize: 18,
              color: "white",
              marginTop: 20,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            Importation en cours, Veillez patientez...
          </Text>
        </View>
      )}
      {contacts.length === 0 ? (
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
          Vous n'avez ajouter aucun contact
        </Text>
      ) : (
        <Atoz
          itemClickAction={() => {}}
          showSearch
          data={contacts.map((contact) => ({
            ...contact,
            key: contact.firstName + " " + contact.lastName,
          }))}
        />
      )}

      <FAB.Group
        fabStyle={{
          backgroundColor: "black",
          borderRadius: 0,
          ...HARD_SHADOW,
          shadowColor: PRIMARY_COLOR,
          shadowOffset: { width: -5, height: 5 },
        }}
        color="white"
        open={contactOpen}
        visible
        icon={contactOpen ? "close" : "account-plus"}
        actions={[
          {
            icon: "contacts",
            label: "Importer votre repertoire",
            onPress: async () => {
              setLoading(true);
              try {
                const isAvailable = await Contacts.isAvailableAsync();

                if (!isAvailable) throw "no-access-to-contact";

                const permission: Contacts.PermissionResponse =
                  await Contacts.requestPermissionsAsync();

                if (!permission.granted) throw "permission-required";

                let _contacts = await Contacts.getContactsAsync();

                const __contacts: IContact[] = _contacts.data
                  .filter(async (contact) => {
                    let notFound = true;

                    contacts.forEach((e) => {
                      if (notFound) notFound = e.id !== contact.id;
                    });

                    return notFound;
                  })
                  .map((contact) => {
                    return {
                      firstName: contact.firstName || "",
                      lastName: contact.lastName || "",
                      email: contact.emails
                        ? contact.emails
                            .map((email) => email.email || "")
                            .filter((e) => e.length > 0)
                        : [],
                      number: contact.phoneNumbers
                        ? contact.phoneNumbers
                            .map((phone) => phone.digits || "")
                            .filter((e) => e.length > 0)
                        : [],
                      id: contact.id,
                      avatar:
                        (contact.firstName
                          ? contact.firstName[0]
                          : contact.lastName
                          ? contact.lastName[0]
                          : "") +
                        (contact.lastName
                          ? contact.lastName[0]
                          : contact.firstName
                          ? contact.firstName[0]
                          : ""),
                    };
                  })
                  .filter(
                    (localContact) =>
                      contacts.filter(
                        (dbContact) => dbContact.id === localContact.id
                      ).length === 0
                  )
                  .sort((a, b) =>
                    (a.firstName + " " + a.lastName).localeCompare(
                      b.firstName + " " + b.lastName
                    )
                  )
                  .filter((_e, i) => i < 50);

                //TODO ADD CONTACT TO FIREBASE

                const contactFuture = __contacts
                  .map(async ({ id, ...contact }) => {
                    try {
                      const contactRef =
                        FIRESTORE.collection("contacts").doc(id);

                      await contactRef.set({
                        ...contact,
                        createdAt: FIREBASE_APP.firestore.Timestamp.now(),
                        uid: user.uid,
                      });
                    } catch (error) {
                      console.error(error);
                      return null;
                    }
                  })
                  .filter((el) => !!el);

                const ici = await Promise.all(contactFuture);

                console.log(ici.length);

                alert(__contacts.length + " Contacts Ajoutes!");
              } catch (error) {
                console.error(error);
              }
              setLoading(false);
            },
            style: {
              backgroundColor: "black",
              borderRadius: 0,
              ...HARD_SHADOW,
              shadowColor: PRIMARY_COLOR,
              shadowOffset: { width: 5, height: 5 },
            },
            color: "white",
          },
          {
            icon: "upload",
            label: "Importer fichier",
            onPress: async () => {
              alert("Arrive tres bientot");
              // return;
              // try {
              //   const doc = await DocumentPicker.getDocumentAsync({
              //     copyToCacheDirectory: true,
              //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              //   });

              //   if (doc.type === "cancel") throw "error";

              //   const fileBase64 = await FileSystem.readAsStringAsync(doc.uri, {
              //     encoding: FileSystem.EncodingType.Base64,
              //   });

              //   const { data } = await axios.post(
              //     "http://localhost:9000/api/sms/parsexlsx",
              //     { file: fileBase64, fileName: doc.name, _file: doc.file },
              //     {
              //       headers: {
              //         Accept: "application/json",
              //         // "Content-Type": "multipart/form-data; charset=UTF-8",
              //       },
              //     }
              //   );

              //   console.log("DATA IS => ", data);
              // } catch (error) {
              //   console.log(JSON.stringify(error.response));
              // }
            },
            style: {
              backgroundColor: "black",
              borderRadius: 0,
              ...HARD_SHADOW,
              shadowColor: PRIMARY_COLOR,
              shadowOffset: { width: 5, height: 5 },
            },
            color: "white",
          },
          {
            icon: "keyboard",
            label: "Ajout manuel",
            style: {
              backgroundColor: "black",
              borderRadius: 0,
              ...HARD_SHADOW,
              shadowColor: PRIMARY_COLOR,
              shadowOffset: { width: 5, height: 5 },
            },
            color: "white",
            onPress: () => navigation.navigate("createContact"),
          },
        ]}
        onStateChange={({ open: _open }) => {
          setContactOpen(_open);
        }}
      />
      <BottomSheet
        isOpen={false}
        ref={panelRef}
        sliderMinHeight={0}
        wrapperStyle={{
          borderRadius: 0,
          elevation: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          shadowOpacity: 0.05,
          paddingLeft: 0,
          paddingRight: 0,
        }}
        innerContentStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: "white",
        }}
        lineStyle={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        outerContentStyle={{ backgroundColor: "rgba(0,0,0,0.035)" }}
      ></BottomSheet>
    </React.Fragment>
  );
};

export default ContactsTab;
