import * as React from "react";
import { Headline, Button, Caption, Chip } from "react-native-paper";
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
import { PRIMARY_COLOR } from "../utils/colors";
import { HARD_SHADOW } from "../utils";

const SelectActivitiesScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
}) => {
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
            marginBottom: 10,
            marginTop: 20,
          }}
        />
        <Headline style={{ marginBottom: 20, fontWeight: "800" }}>
          Sélectionnez vos domaines d'activités.
        </Headline>
        <View style={{ flexDirection: "row" }}>
          <Chip
            onPress={() => console.log("Pressed")}
            style={{
              marginRight: 15,
              marginBottom: 10,
              backgroundColor: "white",
              borderRadius: 0,
              ...HARD_SHADOW,
              shadowOffset: { width: 5, height: 5 },
            }}
          >
            Example Chip
          </Chip>
          <Chip
            selected
            selectedColor="white"
            onPress={() => console.log("Pressed")}
            style={{
              marginRight: 15,
              marginBottom: 10,
              backgroundColor: PRIMARY_COLOR,
              borderRadius: 0,
              ...HARD_SHADOW,
              shadowOffset: { width: 5, height: 5 },
            }}
          >
            Example Chip
          </Chip>
        </View>

        <View style={{ ...HARD_SHADOW, marginTop: 20 }}>
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
              navigation.popToTop();
              navigation.replace("private");
            }}
          >
            Enregistrer
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

export default SelectActivitiesScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 0,
    borderWidth: 1,
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: { height: 8, width: 8 },
    marginBottom: 20,
  },
});
