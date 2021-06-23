import * as React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Paragraph, TextInput, Button } from "react-native-paper";
import { BACKGROUND_COLOR, HARD_SHADOW } from "../utils";

const UpdatePersonalDetails = () => {
  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <ScrollView style={{ padding: 20 }}>
        <Paragraph
          style={{
            textAlign: "center",
            fontSize: 16,
            lineHeight: 25,
            marginBottom: 30,
          }}
        >
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus qui,
          incidunt repellat modi autem eligendi rem ipsam! Placeat, in
          provident! Quibusdam.
        </Paragraph>

        <TextInput
          label="lastname"
          placeholder="Ex: MA BOUTIK"
          style={styles.input}
          dense
          autoFocus
        />
        <TextInput
          label="firstname"
          placeholder="Pourquoi voulez-vous utiliser ce senderID?"
          multiline
          numberOfLines={3}
          style={styles.input}
          dense
        />
        <TextInput
          label="number"
          placeholder="Pourquoi voulez-vous utiliser ce senderID?"
          multiline
          numberOfLines={3}
          style={styles.input}
          dense
        />
        <TextInput
          label="email"
          placeholder="Pourquoi voulez-vous utiliser ce senderID?"
          multiline
          numberOfLines={3}
          style={styles.input}
          dense
        />
        <View style={{ ...HARD_SHADOW }}>
          <Button
            mode="contained"
            style={{ borderRadius: 0, elevation: 0 }}
            contentStyle={{ padding: 5 }}
          >
            Sauvegarder
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default UpdatePersonalDetails;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    ...HARD_SHADOW,
    marginBottom: 20,
    borderRadius: 0,
  },
});
