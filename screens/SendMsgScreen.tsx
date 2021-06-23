import * as React from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Text, Paragraph, Portal, Dialog } from "react-native-paper";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { BACKGROUND_COLOR } from "../utils/colors";
import { HARD_SHADOW, IContact, ISenderID, KEYWORDS } from "../utils";

import Mention from "../libraries/Mention";
import Carousel from "../libraries/Carousel";
import axios from "axios";
import { AUTH } from "../server/db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";

const SendMsgScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
  route,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [message, setMessage] = React.useState<string>("");
  const [saveTemplate, setSaveTemplate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showDialog = () => setSaveTemplate(true);

  const hideDialog = () => setSaveTemplate(false);

  const _renderItem = ({ item, index }: any) => {
    return (
      <TouchableOpacity onPress={() => {}}>
        <View
          key={index}
          style={{
            backgroundColor: "white",
            height: 350,
            maxWidth: 350,
            padding: 15,
            marginRight: 20,
            ...HARD_SHADOW,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              letterSpacing: 0.5,
              textAlign: "center",
            }}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
            minus iste, consequatur ullam facilis iure commodi repudiandae iusto
            veritatis mollitia assumenda quaerat voluptatibus vel incidunt
            laudantium optio quidem maiores omnis? Lorem ipsum, dolor sit amet
            consectetur adipisicing elit. Pariatur minus iste, consequatur ullam
            facilis iure commodi repudiandae iusto veritatis mollitia assumenda
            quaerat voluptatibus vel incidunt laudantium optio quidem maiores
            omnis?
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const sendMessage = async (senderID: string) => {
    setLoading(true);

    try {
      const user = AUTH.currentUser;
      const contacts = [];
      let _msg = message;

      KEYWORDS.forEach((e) => {
        const reg = RegExp(e.label, "g");
        _msg = _msg.replace(reg, "@" + e.value);
      });

      (route.params.selectedContacts as IContact[]).forEach((el) => {
        el.number.forEach((n) => {
          contacts.push({
            number: n.replace("+", ""),
            firstName: el.firstName,
            lastName: el.lastName,
            fullName: el.firstName + " " + el.lastName,
            email: el.email.length > 0 ? el.email[0] : "",
          });
        });
      });

      const url =
        process.env.NODE_ENV === "production"
          ? "https://rest.drosarl.com/api/sms/campain"
          : "http://localhost:9000/api/sms/campain";

      const { data } = await axios.post(url, {
        senderID,
        contacts: contacts,
        lang: "fr",
        message: _msg.trim(),
        apiKey: user.uid,
        uid: user.uid,
        partnerID: "MOJO_SMS",
      });

      console.log(data);
      if (!data.success) throw data.data;

      // TODO CALCULATE MSG COUNT

      // TODO MENTION HOW MANY MESSAGE WILL BE USED

      //TODO SAVE TEMPLATE

      // TODO CLEAN MESSAGE INPUT
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}
      >
        <Text
          style={{
            padding: 20,
            paddingHorizontal: 40,
            fontSize: 13,
            lineHeight: 25,
            textAlign: "center",
            marginBottom: 0,
            fontWeight: "700",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Vos Message Enregistrés
        </Text>
        <View style={{ flex: 1 }}>
          <Carousel data={[1, 2, 4, 5]} renderItem={_renderItem} />
        </View>

        <Mention
          onChangeText={(e) => setMessage(e)}
          placeholder="Entrez votre message..."
          placeholderTextColor="#888"
          style={{
            padding: 10,
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: "white",
            ...(message.trim().length === 0 ? {} : HARD_SHADOW),
            borderWidth: 1,
            borderColor: "black",
          }}
        />
        <View
          style={{
            ...(message.trim().length === 0 ? {} : HARD_SHADOW),
            marginHorizontal: 20,
            width: 130,
            alignSelf: "flex-end",
            borderColor: "#000",
            borderWidth: 1,
            borderTopWidth: 0,
            marginBottom: 20,
          }}
        >
          <Button
            disabled={message.trim().length === 0}
            mode="contained"
            style={{ elevation: 10, borderRadius: 0 }}
            labelStyle={{ fontSize: 13, fontWeight: "700" }}
            onPress={async () => {
              console.log(message);
              const senderIDs: ISenderID[] = JSON.parse(
                await AsyncStorage.getItem("@senderIDs")
              );

              showActionSheetWithOptions(
                {
                  options:
                    senderIDs.length === 0
                      ? ["Créer SenderID"]
                      : [...senderIDs.map((e) => e.name), "Annuler"],
                  cancelButtonIndex:
                    senderIDs.length === 0 ? null : senderIDs.length,
                  title: "Sélectionnez votre senderID",
                },

                async (i) => {
                  if (senderIDs.length === 0) {
                    navigation.navigate("createSenderID");
                  } else {
                    await sendMessage(senderIDs[i] ? senderIDs[i].name : "");
                  }
                }
              );
            }}
          >
            Envoyer
          </Button>
        </View>
        <Portal>
          <Dialog visible={saveTemplate} onDismiss={hideDialog}>
            <Dialog.Title>Success</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Votre message a ete envoyer avec success. Voulez-vous
                sauvegarder votre dernier message entant que template?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Annuler</Button>
              <Button onPress={hideDialog}>Sauvegarder</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SendMsgScreen;
