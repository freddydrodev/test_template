import * as React from "react";
import { Headline, Text, Button, Caption } from "react-native-paper";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { HARD_SHADOW } from "../utils";
import axios from "axios";
import { AUTH, FIREBASE_APP, FIRESTORE } from "../server/db";

const CELL_COUNT = 6;

const VerifyNumberScreen: React.FC<StackScreenProps<any>> = ({ route }) => {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const {
    params: { id, number },
  } = route;

  const verifyOTP = async () => {
    setLoading(true);
    try {
      if (value.length !== 6)
        throw { message: "Vous devez entrer les 6 Chiffres" };
      const { data: axiosData } = await axios.post(
        "https://portal.bulkgate.com/api/1.0/otp/verify",
        {
          application_id: "21421",
          application_token:
            "Gsc7iDVX5cYCXByHHrt8KzQgRzQQ5QgEcXeHpKdD91xPzdZ9gu",
          id,
          code: value,
        }
      );

      if (!axiosData.data.verified) {
        throw { message: "Mauvais Code" };
      }

      const authEmail = number + "." + "mojo_sms" + "@mojosms.com";
      const authPass = "P@ssw0rd." + "MOJO_SMS";

      const _existingUserResult = await FIRESTORE.collection("companies")
        .where("authEmail", "==", authEmail)
        .get();

      console.log(_existingUserResult.empty, authEmail);

      if (_existingUserResult.docs.length === 0) {
        console.log("reg");
        const { user } = await AUTH.createUserWithEmailAndPassword(
          authEmail,
          authPass
        );

        await FIRESTORE.collection("companies").doc(user.uid).set({
          createdAt: FIREBASE_APP.firestore.Timestamp.now(),
          number,
          authEmail,
          availableSMS: 0,
          usedSMS: 0,
          credits: 0,
          moovUsage: 0,
          mtnUsage: 0,
          orangeUsage: 0,
          internationalUsage: 0,
          directUsage: 0,
          scheduledUsage: 0,
          broadcastUsage: 0,
          adsUsage: 0,
        });
      } else {
        console.log("ici");
        await AUTH.signInWithEmailAndPassword(authEmail, authPass);
      }
    } catch (error) {
      console.error(error);
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
          Entrez votre OTP
        </Headline>
        <Text
          style={{
            opacity: 0.45,
            lineHeight: 20,
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Veuillez Entrer le code OTP (code a 6 chiffres) reçu par message sur
          le +{number}.
        </Text>
        <CodeField
          autoFocus
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.root}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}
            >
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
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
            onPress={verifyOTP}
          >
            {loading ? "Verification en cours..." : "Verifier mon numero"}
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

export default VerifyNumberScreen;

const styles = StyleSheet.create({
  root: { flex: 1, paddingVertical: 20, marginTop: 10 },
  codeFieldRoot: {
    marginTop: 20,
    shadowColor: "red",
    shadowRadius: 10,
    shadowOpacity: 1,
    shadowOffset: { height: 5, width: 5 },
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    marginBottom: 30,
    borderColor: "black",
    borderWidth: 1,
    backgroundColor: "#fff",
    textAlign: "center",
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: { height: 8, width: 8 },
  },
  focusCell: {
    borderColor: "#e3474d",
    shadowColor: "#e3474d",
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: { height: 8, width: 8 },
    color: "#e3474d",
  },
});
