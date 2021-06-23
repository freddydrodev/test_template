import * as React from "react";
import { Headline, Button, Caption } from "react-native-paper";
import {
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { useForm, Controller } from "react-hook-form";
import { HARD_SHADOW, PRIMARY_COLOR } from "../utils";
import { AUTH, FIRESTORE } from "../server/db";

const RegisterDetailsScreen: React.FC<StackScreenProps<any>> = ({
  navigation,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: {
    companyName: string;
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    try {
      const user = AUTH.currentUser;

      if (!user) throw { message: "Erreur interne" };

      await FIRESTORE.collection("companies").doc(user.uid).update(data);

      // navigation.navigate("selectActivities");
      navigation.replace("private");
    } catch (error) {
      alert(error.message);
      console.error(error);
    }

    setLoading(false);
  };

  console.log(errors);
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
          Veuillez Entrer Vos coordonées
        </Headline>

        <Controller
          control={control}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              // label="Nom de Famille"
              // dense
              placeholder="Nom de Famille"
              autoCorrect={false}
              style={styles.input}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
            />
          )}
          name="lastName"
          rules={{ required: true, minLength: 2 }}
          defaultValue=""
        />
        {errors.lastName && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez votre nom de famille
          </Caption>
        )}

        <Controller
          control={control}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              autoCorrect={false}
              // label="Prenom"
              // dense
              placeholder="Prenom"
              style={styles.input}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
            />
          )}
          name="firstName"
          rules={{ required: true, minLength: 2 }}
          defaultValue=""
        />
        {errors.firstName && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez votre prenom
          </Caption>
        )}

        <Controller
          control={control}
          render={({ field: { onBlur, value, onChange } }) => (
            <TextInput
              // label="Nom de la compagnie"
              // dense
              placeholder="Nom de la compagnie"
              autoCorrect={false}
              style={styles.input}
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => onChange(text)}
            />
          )}
          name="companyName"
          rules={{ required: true, minLength: 3 }}
          defaultValue=""
        />
        {errors.companyName && (
          <Caption style={{ marginBottom: 20, color: PRIMARY_COLOR }}>
            Entrez le nom de votre compagnie
          </Caption>
        )}

        <View style={loading ? null : HARD_SHADOW}>
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
            loading={loading}
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? "Enregistrement en cours..." : "Enregistrer"}
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

export default RegisterDetailsScreen;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    ...HARD_SHADOW,
    borderRadius: 0,
    marginBottom: 20,
    padding: 15,
    fontSize: 16,
  },
});
