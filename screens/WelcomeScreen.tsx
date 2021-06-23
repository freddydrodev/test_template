import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { View, Image } from "react-native";
import { Text, Headline, Button } from "react-native-paper";
import { HARD_SHADOW } from "../utils";
import { TEXT } from "../utils/text";

const WelcomeScreen: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f6e3ce" }}>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: 20,
          flex: 1,
        }}
      >
        <Image
          source={require("../assets/mojosms.png")}
          resizeMode="cover"
          style={{ width: 60, height: 60, marginBottom: 20 }}
        />
        <Headline style={{ marginBottom: 10, fontWeight: "800" }}>
          {TEXT["WelcomeScreen/title"]["fr"]}
        </Headline>
        <Text style={{ opacity: 0.45, lineHeight: 20, fontSize: 16 }}>
          {TEXT["WelcomeScreen/description"]["fr"]}
        </Text>
        <View
          style={{
            ...HARD_SHADOW,
            marginBottom: 20,
            marginTop: 40,
            width: "100%",
          }}
        >
          <Button
            contentStyle={{
              padding: 7,
            }}
            style={{
              width: "100%",
              elevation: 0,
              borderRadius: 0,
            }}
            mode="contained"
            onPress={() => {
              navigation.navigate("login");
            }}
          >
            Commencer
          </Button>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
