import * as React from "react";
import { Headline, Text, Button, Caption } from "react-native-paper";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import PhoneInput from "react-native-phone-number-input";
import { HARD_SHADOW } from "../utils";
import axios from "axios";
import publicIP from "react-native-public-ip";

const LoginScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [number, setNumber] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const callOTP = async () => {
    setLoading(true);
    try {
      if (number.length < 11) throw { message: "Mauvais Numero" };

      const ip = await publicIP();

      console.log(ip);

      const { data: axiosData } = await axios.post(
        "https://portal.bulkgate.com/api/1.0/otp/send",
        {
          application_id: "21421",
          number,
          application_token:
            "Gsc7iDVX5cYCXByHHrt8KzQgRzQQ5QgEcXeHpKdD91xPzdZ9gu",
          language: "fr",
          request_quota_number: 1,
          request_quota_identification: ip,
          channel: {
            sms: {
              sender_id: "gText",
              sender_id_value: "MOJO SMS",
              unicode: false,
            },
          },
        }
      );

      console.log(axiosData.data);

      navigation.navigate("verifyNumber", { id: axiosData.data.id, number });
    } catch (error) {
      console.error(JSON.stringify(error.response.data));
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f6e3ce" }}
    >
      <ScrollView style={{ padding: 20 }}>
        <Image
          source={require("../assets/mojosms.png")}
          resizeMode="cover"
          style={{
            width: 60,
            height: 60,
            marginBottom: 20,
            marginTop: 60,
            alignSelf: "center",
          }}
        />
        <Headline
          style={{ marginBottom: 10, textAlign: "center", fontWeight: "800" }}
        >
          Veuillez vous identifier
        </Headline>
        <Text
          style={{
            opacity: 0.45,
            lineHeight: 20,
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Veuillez Entrer votre numéro et saisissez le code d'authentification
          reçu.
        </Text>
        <PhoneInput
          defaultCode="CI"
          layout="first"
          onChangeFormattedText={(text) => {
            setNumber(text.replace("+", ""));
          }}
          autoFocus
          containerStyle={{
            width: "100%",
            marginVertical: 30,
            backgroundColor: "white",
            ...HARD_SHADOW,
          }}
          textInputStyle={{ backgroundColor: "white" }}
          textContainerStyle={{ backgroundColor: "white" }}
        />

        <View style={loading ? {} : HARD_SHADOW}>
          <Button
            loading={loading}
            disabled={loading}
            contentStyle={{
              padding: 7,
            }}
            style={{
              width: "100%",
              elevation: 0,
              borderRadius: 0,
            }}
            mode="contained"
            onPress={callOTP}
          >
            {loading ? "Envoie en cours..." : "Envoyez le Code"}
          </Button>
        </View>
        <TouchableOpacity>
          <Caption style={{ textAlign: "center", padding: 10 }}>
            Verifier les termes et conditions
          </Caption>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
