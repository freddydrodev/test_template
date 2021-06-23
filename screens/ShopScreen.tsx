import * as React from "react";
import { View } from "react-native";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../utils/colors";
import { createStackNavigator } from "@react-navigation/stack";
import Carousel from "../libraries/Carousel";
import Offer from "../components/Offert";
import { IOffer, IUser, NETWORKS } from "../utils";
import { FIREBASE_APP, FIRESTORE } from "../server/db";
import { Button, Headline, Text } from "react-native-paper";
import BottomSheet from "react-native-simple-bottom-sheet";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import PhoneInput from "react-native-phone-number-input";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Stack = createStackNavigator();

const ShopView = () => {
  const [offers, setOffers] = React.useState<IOffer[]>([]);
  const [selectedOffer, setSelectedOffer] = React.useState<IOffer>(null);
  const [number, setNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<IUser>(null);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0); // network index
  const panelRef = React.useRef(null);

  const getOffers = async () => {
    try {
      const offersResult = await FIRESTORE.collection("CONFIGS")
        .doc("PRICINGS")
        .get();

      if (offersResult.exists) {
        const _offers = offersResult.data();

        setOffers(_offers.plans);
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getOffers();
  }, []);

  const getUser = async () => {
    const _user: IUser = JSON.parse(await AsyncStorage.getItem("@user"));

    setUser(_user);
  };

  React.useEffect(() => {
    getUser();
  }, []);
  // const [contacts, setContacts] = React.useState<IContact[]>([]);

  // const getLocalContacts = async () => {
  //   try {
  //     const _contacts = await AsyncStorage.getItem("@contacts");

  //     const _ = JSON.parse(_contacts);

  //     setContacts(_ || []);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // React.useEffect(() => {
  //   getLocalContacts();
  // }, []);

  const togglePayment = (offer: IOffer) => {
    setSelectedOffer(offer);
    panelRef.current.togglePanel();
  };

  const payHanlder = async () => {
    setLoading(true);
    try {
      if (number.length !== 13) throw { message: "Mauvais Numero" };
      if (!number.startsWith("225")) {
        throw { message: "Vous ne pouvez payer qu'avec un numero ivoirien!" };
      }

      if (!user) throw { message: "Erreur inconnue" };

      console.log(user);
      const total = selectedOffer.smsCount * selectedOffer.price;

      const order = await FIRESTORE.collection("orders").add({
        createdAt: FIREBASE_APP.firestore.Timestamp.now(),
        uid: user.uid,
        amount: total,
        smsCount: selectedOffer.smsCount,
        unitPrice: selectedOffer.price,
        network: NETWORKS[selectedIndex],
        customerDetails: {
          fullname: user.firstName + " " + user.lastName,
          number: number,
        },
        status: "PENDING",
      });

      const payload = {
        apiKey: "YU6PesqX9FNMXrX0H6mexDwpPFA3",
        appID: "D3Ng0NqDmAHduCLdWQQI",
        amount: total,
        orderID: order.id,
        customerID: user.uid,
        merchantID: "YU6PesqX9FNMXrX0H6mexDwpPFA3",
        provider: "MOBILE_MONEY",
        country: "CI",
        network: NETWORKS[selectedIndex],
        customerDetails: {
          fullname: user.firstName + " " + user.lastName,
          number: number,
        },
      };

      const { data } = await axios.post(
        "https://rest.drosarl.com/api/pay",
        payload
      );

      console.log(data);

      if (data != null && data["success"]) {
        alert("Paiement initié");

        const url = data["data"]["payment_url"];

        if (url != null) {
          await WebBrowser.openBrowserAsync(url);
        }
      } else {
        throw { message: "Erreur interne" };
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 20 }}
    >
      <Headline
        style={{ marginBottom: 20, textAlign: "center", paddingHorizontal: 40 }}
      >
        Choisissez une Offre
      </Headline>
      <Carousel
        onSnapToItem={(index) => {
          setSelectedOffer(offers[index]);
        }}
        data={offers}
        renderItem={({ item }) => (
          <Offer togglePayment={togglePayment} {...item} />
        )}
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
      >
        {selectedOffer && (
          <>
            <Text
              style={{
                paddingVertical: 20,
                fontSize: 16,
                textAlign: "center",
                margin: 0,
              }}
            >
              Vous allez payer{" "}
              <Text style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
                {selectedOffer.price * selectedOffer.smsCount} FR CFA
              </Text>{" "}
              pour{" "}
              <Text style={{ fontWeight: "bold", color: PRIMARY_COLOR }}>
                {selectedOffer.smsCount} SMS
              </Text>
            </Text>
            {selectedOffer.price * selectedOffer.smsCount < 20000 && (
              <View>
                <SegmentedControl
                  values={NETWORKS}
                  selectedIndex={selectedIndex}
                  onChange={(event) => {
                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
                  }}
                />
                <PhoneInput
                  containerStyle={{ marginVertical: 20, flex: 1 }}
                  defaultCode="CI"
                  onChangeFormattedText={(text) => {
                    setNumber(text.replace("+", ""));
                  }}
                />
                <Button
                  loading={loading}
                  disabled={loading}
                  onPress={payHanlder}
                  mode="contained"
                  style={{ elevation: 0 }}
                >
                  Payer
                </Button>
                <Text
                  style={{
                    marginVertical: 10,
                    textAlign: "center",
                    fontSize: 16,
                  }}
                >
                  ou
                </Text>
              </View>
            )}

            <Button
              mode="outlined"
              onPress={() =>
                Linking.openURL(
                  "https://api.whatsapp.com/message/O7XLZYOQMDDNO1?text=" +
                    encodeURI(
                      `je suis interesse par l'offre de ${
                        selectedOffer.smsCount
                      }SMS a ${
                        selectedOffer.smsCount * selectedOffer.price
                      } FR CFA`
                    )
                )
              }
            >
              Contactez-nous
            </Button>
          </>
        )}
      </BottomSheet>
    </View>
  );
};

const ShopScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="group"
        component={ShopView}
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR },
          headerTitleStyle: { color: "white" },
          title: "Boutique",
        }}
      />
    </Stack.Navigator>
  );
};

export default ShopScreen;
