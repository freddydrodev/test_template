import * as React from "react";
import { ScrollView, View, TextInput } from "react-native";
import { Text, Paragraph, Button } from "react-native-paper";
import { BACKGROUND_COLOR, HARD_SHADOW, PRIMARY_COLOR } from "../utils";
import { useForm, Controller } from "react-hook-form";
import { AUTH, FIREBASE_APP, FIRESTORE } from "../server/db";
import { StackScreenProps } from "@react-navigation/stack";

const CreateSenderID: React.FC<StackScreenProps<any>> = ({ navigation }) => {
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: { senderID: string; reason: string }) => {
    setLoading(true);
    try {
      console.log(data);
      const user = AUTH.currentUser;

      const senderRef = FIRESTORE.collection("senderIDs").doc(data.senderID);

      const sender = await senderRef.get();

      if (sender.exists) throw "Ce SenderID exists deja!";

      await FIRESTORE.collection("senderIDs").doc(data.senderID).set({
        uid: user.uid,
        createdAt: FIREBASE_APP.firestore.Timestamp.now(),
        reason: data.reason,
        verified: false,
        status: "PENDING",
        name: data.senderID,
      });

      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert(error);
    }
    setLoading(false);
  };

  console.log(errors);

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

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Entrez votre SenderID" },
            minLength: {
              value: 2,
              message: "Vous devez entrer au moins 2 characteres",
            },
            maxLength: {
              value: 11,
              message: "Vous devez entrer au plus 11 characteres",
            },
          }}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              placeholder="SenderID"
              style={{
                marginBottom: 20,
                ...HARD_SHADOW,
                backgroundColor: "white",
                padding: 15,
                fontSize: 16,
              }}
              autoFocus
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
            />
          )}
          name="senderID"
          defaultValue=""
        />
        {errors.senderID && (
          <Text style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            {errors.senderID.message}
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              placeholder="Justificatif"
              multiline
              numberOfLines={3}
              style={{
                marginBottom: 20,
                ...HARD_SHADOW,
                backgroundColor: "white",
                padding: 15,
                fontSize: 16,
              }}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
            />
          )}
          name="reason"
          defaultValue=""
        />
        {errors.reason && (
          <Text style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Vous devez entrer votre justificatif
          </Text>
        )}

        <View style={loading ? null : HARD_SHADOW}>
          <Button
            disabled={loading}
            loading={loading}
            mode="contained"
            style={{ borderRadius: 0, elevation: 0 }}
            contentStyle={{ padding: 5 }}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? "Creation en cours..." : "Creer"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateSenderID;
