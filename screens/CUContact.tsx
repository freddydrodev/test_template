import * as React from "react";
import {
  ScrollView,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { Paragraph, Button, Caption } from "react-native-paper";
// import PhoneInput, { isValidNumber } from "react-native-phone-number-input";
import { useForm, Controller } from "react-hook-form";

import {
  BACKGROUND_COLOR,
  HARD_SHADOW,
  IContact,
  PRIMARY_COLOR,
} from "../utils";
import { AUTH, FIREBASE_APP, FIRESTORE } from "../server/db";
import { StackScreenProps } from "@react-navigation/stack";
import PhoneInput from "react-native-phone-input";
import { useActionSheet } from "@expo/react-native-action-sheet";

const CUContact: React.FC<StackScreenProps<any>> = ({ navigation, route }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { params } = route;

  const contact: IContact = params && params.contact ? params.contact : null;
  const [number, setNumber] = React.useState<string>(
    contact ? contact.number[0] : ""
  );
  const { showActionSheetWithOptions } = useActionSheet();

  React.useEffect(() => {
    if (contact && contact.number.length > 1) {
      showActionSheetWithOptions(
        {
          options: contact.number,
          title: "Selectionnez le numero que vous desirez garder",
        },
        async (buttonIndex: number) => {
          setNumber(contact.number[buttonIndex]);
        }
      );
    }
  }, [contact]);

  const onSubmit = async ({ firstName, lastName, email }) => {
    setLoading(true);
    try {
      console.log("NUMBER => ", number);
      if (number.length < 12) throw { message: "Mauvais Numero" };

      const user = AUTH.currentUser;

      if (!user) throw { message: "Erreur interne" };

      const data = {
        number: [number],
        email: email ? [email] : [],
        firstName,
        lastName,
        avatar: firstName[0].toUpperCase() + lastName[0].toUpperCase(),
      };

      if (contact) {
        await FIRESTORE.collection("contacts").doc(contact.id).update(data);
        alert("Contact Modife");
      } else {
        await FIRESTORE.collection("contacts").add({
          uid: user.uid,
          createdAt: FIREBASE_APP.firestore.Timestamp.now(),
          ...data,
        });
        alert("Contact Ajoute");
      }

      navigation.goBack();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}
    >
      <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
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
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              autoCorrect={false}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholderTextColor="rgba(0,0,0,0.5)"
              placeholder="Nom de Famille"
              defaultValue={contact ? contact.lastName : ""}
              style={{
                marginBottom: 20,
                ...HARD_SHADOW,
                backgroundColor: "white",
                padding: 15,
                fontSize: 16,
              }}
            />
          )}
          name="lastName"
          rules={{ required: true, minLength: 2 }}
          defaultValue={contact ? contact.lastName : ""}
        />
        {errors.lastName && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez le nom de famille
          </Caption>
        )}

        <Controller
          control={control}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              autoCorrect={false}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="Prenom"
              defaultValue={contact ? contact.firstName : ""}
              placeholderTextColor="rgba(0,0,0,0.5)"
              numberOfLines={3}
              style={{
                marginBottom: 20,
                ...HARD_SHADOW,
                backgroundColor: "white",
                padding: 15,
                fontSize: 16,
              }}
            />
          )}
          name="firstName"
          rules={{ required: true, minLength: 2 }}
          defaultValue={contact ? contact.firstName : ""}
        />
        {errors.firstName && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez le prenom
          </Caption>
        )}

        <PhoneInput
          onChangePhoneNumber={(number) => {
            setNumber(number);
          }}
          allowZeroAfterCountryCode
          initialCountry="ci"
          textProps={{
            placeholder: "Numero de telephone",
            placeholderTextColor: "#555",
            value: number,
          }}
          style={{
            width: "100%",
            marginBottom: 30,
            backgroundColor: "white",
            padding: 15,
            ...HARD_SHADOW,
          }}
        />

        <Controller
          control={control}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              autoCorrect={false}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
              placeholder="Addresse Email"
              defaultValue={contact && contact.email ? contact.email[0] : ""}
              placeholderTextColor="rgba(0,0,0,0.5)"
              numberOfLines={3}
              style={{
                marginBottom: 20,
                ...HARD_SHADOW,
                backgroundColor: "white",
                padding: 15,
                fontSize: 16,
              }}
            />
          )}
          name="email"
          rules={{ minLength: 5 }}
          defaultValue={contact && contact.email ? contact.email[0] : ""}
        />
        {errors.email && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez une addresse email correct
          </Caption>
        )}

        <View style={loading ? null : { ...HARD_SHADOW, marginBottom: 110 }}>
          <Button
            mode="contained"
            style={{ borderRadius: 0, elevation: 0 }}
            contentStyle={{ padding: 5 }}
            loading={loading}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading
              ? `${contact ? "Modification" : "Ajout"} en cours...`
              : contact
              ? "Modifier"
              : "Ajouter"}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CUContact;
