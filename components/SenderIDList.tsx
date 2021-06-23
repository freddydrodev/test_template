import * as React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text, Caption, FAB } from "react-native-paper";
import { PRIMARY_COLOR } from "../utils/colors";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { HARD_SHADOW, ISenderID } from "../utils";
import { AUTH, FIRESTORE } from "../server/db";
import firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SenderIDList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [senderIDs, setSenderIDs] = React.useState<ISenderID[]>([]);
  const [user, setUser] = React.useState<firebase.User>();

  React.useEffect(() => AUTH.onAuthStateChanged((user) => setUser(user)));

  React.useEffect(() => {
    if (user)
      return FIRESTORE.collection("senderIDs")
        .where("uid", "==", user.uid)
        .onSnapshot(async (snap) => {
          const _senderIDs = snap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as any),
          }));

          setSenderIDs(_senderIDs);
          await AsyncStorage.setItem("@senderIDs", JSON.stringify(_senderIDs));
        });
  }, [user]);

  const getStatusIcon = (senderID: ISenderID) => {
    switch (senderID.status) {
      case "ACCEPTED":
        return (
          <AntDesign
            name="checkcircle"
            size={24}
            color="#6EE59F"
            style={{ marginBottom: 20 }}
          />
        );
      case "CANCELED":
        return (
          <Ionicons
            name="alert-circle"
            size={28}
            color={PRIMARY_COLOR}
            style={{
              marginBottom: 20,
            }}
          />
        );

      case "PENDING":
      default:
        return (
          <AntDesign
            name="clockcircle"
            size={24}
            color="#4772F2"
            style={{ marginBottom: 20 }}
          />
        );
    }
  };

  console.log(senderIDs);

  return (
    <View
      style={{
        overflow: "hidden",
      }}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{
          marginTop: 30,
          paddingLeft: 20,
        }}
      >
        {senderIDs.length < 5 && (
          <View style={{ justifyContent: "center", marginRight: 20 }}>
            <FAB
              label={senderIDs.length === 0 ? "Ajouter un senderID" : null}
              style={{
                backgroundColor: PRIMARY_COLOR,
                borderRadius: 0,
                ...HARD_SHADOW,
                shadowOffset: { width: 5, height: 5 },
                marginBottom: 20,
              }}
              small
              icon="plus"
              onPress={() => navigation.navigate("createSenderID")}
            />
          </View>
        )}

        {senderIDs.map((senderID) => (
          <TouchableOpacity
            key={senderID.id}
            onPress={() =>
              alert(
                senderID.status === "CANCELED"
                  ? "Le justificatif n'est pas suffisant contactez le support pour une verification"
                  : senderID.name +
                      (senderID.status === "ACCEPTED"
                        ? " est actif"
                        : " est en cours de verification")
              )
            }
          >
            <View
              style={{
                width: 160,
                backgroundColor: "rgba(255,255,255,1)",
                padding: 15,
                borderRadius: 0,
                marginRight: 20,
                marginBottom: 20,
                ...HARD_SHADOW,
              }}
            >
              {getStatusIcon(senderID)}

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  letterSpacing: 2,
                  marginBottom: 5,
                }}
              >
                {senderID.name}
              </Text>
              <Caption>{senderID.messageCount || 0} Messages</Caption>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SenderIDList;
