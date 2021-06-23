import * as React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Text, Caption, Avatar, List } from "react-native-paper";
import { FlatGrid } from "react-native-super-grid";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../utils/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StackScreenProps } from "@react-navigation/stack";
import { useActionSheet } from "@expo/react-native-action-sheet";

import { HARD_SHADOW, IUser } from "../utils";
import SenderIDList from "../components/SenderIDList";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MessageSummaryScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const [user, setUser] = React.useState<IUser>();

  const getUser = async () => {
    const _user = JSON.parse(await AsyncStorage.getItem("@user"));

    setUser(_user);
  };

  const userStats = {
    "Moov CI": {
      value: user ? user.moovUsage || 0 : 0,
      logo: {
        uri: "https://www.duticotac.com/images/moov_new.png",
      },
    },
    "MTN CI": {
      value: user ? user.mtnUsage || 0 : 0,
      logo: {
        uri: "https://www.duticotac.com/images/mtn.png",
      },
    },
    "Orange CI": {
      value: user ? user.orangeUsage || 0 : 0,
      logo: {
        uri: "https://www.duticotac.com/images/om.png",
      },
    },
    Internationnal: {
      value: user ? user.internationalUsage || 0 : 0,
      logo: require("../assets/worldwide.png"),
    },
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <FlatList
        data={[{ key: "1" }]}
        renderItem={(i) => (
          <React.Fragment key={i.index}>
            <SenderIDList navigation={navigation} />

            <Text
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                fontSize: 13,
                fontWeight: "600",
                letterSpacing: 1,
                textTransform: "uppercase",
                // opacity: 0.85,
                color: PRIMARY_COLOR,
              }}
            >
              Envoie de message
            </Text>
            <FlatGrid
              scrollEnabled={false}
              spacing={20}
              itemDimension={130}
              data={[
                {
                  title: "Direct",
                  color: "#EE742F",
                  count: user ? user.directUsage || 0 : 0,
                  icon: (
                    <FontAwesome
                      name="send"
                      size={36}
                      color="white"
                      style={{ marginTop: 20 }}
                    />
                  ),
                },
                {
                  title: "Programmé",
                  color: "#6A7CEF",
                  count: user ? user.scheduledUsage || 0 : 0,

                  icon: (
                    <FontAwesome
                      name="clock-o"
                      size={36}
                      color="white"
                      style={{ marginTop: 20 }}
                    />
                  ),
                },

                {
                  title: "Diffusé",
                  color: "#52AC85",
                  count: user ? user.broadcastUsage || 0 : 0,

                  icon: (
                    <FontAwesome
                      name="bullhorn"
                      size={36}
                      color="white"
                      style={{ marginTop: 20 }}
                    />
                  ),
                },
                {
                  title: "Geolocalisé",
                  color: "#F5B63F",
                  count: user ? user.adsUsage || 0 : 0,

                  icon: (
                    <FontAwesome
                      name="globe"
                      size={36}
                      color="white"
                      style={{ marginTop: 20 }}
                    />
                  ),
                },
              ]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.title === "Direct") {
                      showActionSheetWithOptions(
                        {
                          options: ["Contacts", "Groupes", "Annuler"],
                          cancelButtonIndex: 2,
                          title: "Message " + item.title + " vers",
                        },
                        (buttonIndex) => {
                          if (buttonIndex === 0) {
                            navigation.navigate("selectContact");
                          } else if (buttonIndex === 1) {
                            navigation.navigate("selectGroup");
                          }
                        }
                      );
                    } else {
                      alert("Arrive Tres Bientot");
                    }
                  }}
                  key={item.title}
                >
                  <View
                    style={{
                      backgroundColor: item.color || "black",
                      paddingHorizontal: 20,
                      paddingVertical: 30,
                      borderRadius: 0,
                      ...HARD_SHADOW,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 15,
                        letterSpacing: 1,
                        fontWeight: "bold",
                        marginBottom: 10,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        opacity: 0.6,
                        color: "white",
                      }}
                    >
                      {item.count} Messages
                    </Text>
                    {item.icon}
                  </View>
                </TouchableOpacity>
              )}
            />
            <Text
              style={{
                marginHorizontal: 20,
                fontSize: 13,
                fontWeight: "700",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 20,
                // opacity: 0.85,
                color: PRIMARY_COLOR,
              }}
            >
              Statistique
            </Text>
            {Object.keys(userStats).map((key) => (
              <List.Item
                key={key}
                style={{
                  justifyContent: "center",
                  backgroundColor: "white",
                  marginHorizontal: 20,
                  marginBottom: 20,
                  borderRadius: 0,
                  ...HARD_SHADOW,
                }}
                title={key}
                titleStyle={{ fontWeight: "600" }}
                description="SMS envoyes ce mois"
                left={(props) => (
                  <Avatar.Image
                    {...props}
                    source={userStats[key].logo}
                    size={50}
                  />
                )}
                right={() => (
                  <View style={{ alignSelf: "center", marginRight: 10 }}>
                    <Text
                      style={{
                        fontWeight: "900",
                        fontSize: 16,
                        textAlign: "right",
                      }}
                    >
                      {userStats[key].value}
                    </Text>
                    <Caption
                      style={{ textAlign: "right", color: PRIMARY_COLOR }}
                    >
                      (
                      {Math.ceil(
                        user ? (userStats[key].value / user.usedSMS) * 100 : 0
                      )}
                      %)
                    </Caption>
                  </View>
                )}
              />
            ))}
          </React.Fragment>
        )}
        showsVerticalScrollIndicator={false}
        style={{
          flexDirection: "column",
          flex: 1,
        }}
      />
    </View>
  );
};

export default MessageSummaryScreen;
