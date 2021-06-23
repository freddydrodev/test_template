import * as React from "react";
import { View, ScrollView } from "react-native";
import { Text, List, Caption } from "react-native-paper";
import { BACKGROUND_COLOR, PRIMARY_COLOR } from "../utils/colors";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import { HARD_SHADOW, IUser } from "../utils";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const AccountView: React.FC<StackScreenProps<any>> = () => {
  const [user, setUser] = React.useState<IUser>();

  const getUser = async () => {
    setUser(JSON.parse(await AsyncStorage.getItem("@user")));
  };

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ padding: 20 }}>
        <Text style={{ fontSize: 21, fontWeight: "700", opacity: 0.65 }}>
          Salut,
        </Text>
        <Text style={{ fontSize: 32, fontWeight: "900", marginBottom: 30 }}>
          {user && user.firstName}!
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 10,
            alignItems: "center",
            backgroundColor: "black",
            padding: 20,
            ...HARD_SHADOW,
            shadowColor: PRIMARY_COLOR,
          }}
        >
          <Caption
            style={{ width: 80, color: BACKGROUND_COLOR, fontWeight: "700" }}
          >
            SMS Disponible
          </Caption>
          <Text
            style={{
              fontSize: 42,
              lineHeight: 42,
              fontWeight: "900",
              color: PRIMARY_COLOR,
            }}
          >
            {user && user.availableSMS}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "white",
            marginBottom: 30,
            marginTop: 20,
            elevation: 3,
            ...HARD_SHADOW,
          }}
        >
          {/* <List.Item
            onPress={() => {}}
            title="Voir mon profile"
            titleStyle={{ fontWeight: "500" }}
          /> */}
          {/* <List.Item
            onPress={() => {
              navigation.navigate("updatePersonalDetails");
            }}
            title="Modifier mes details personnel"
            titleStyle={{ fontWeight: "500" }}
          />
          <List.Item
            onPress={() => {
              navigation.navigate("updateCompanyDetails");
            }}
            title="Modifier les details de ma compagnie"
            titleStyle={{ fontWeight: "500" }}
          /> */}
          {/* <List.Item
            onPress={() => {}}
            title="Achats"
            titleStyle={{ fontWeight: "500" }}
          /> */}
          <List.Item
            onPress={async () => {
              // Linking.openURL("https://mojosms.com/terms");
              await WebBrowser.openBrowserAsync("https://mojosms.com/terms");
            }}
            title="Termes & Condition"
            titleStyle={{ fontWeight: "500" }}
          />

          <List.Item
            onPress={async () => {
              // Linking.openURL("https://mojosms.com/terms");
              await WebBrowser.openBrowserAsync("https://mojosms.com/privacy");
            }}
            title="Politique de confidentialite"
            titleStyle={{ fontWeight: "500" }}
          />
          <List.Item
            onPress={async () => {
              // Linking.openURL("https://mojosms.com/terms");
              await WebBrowser.openBrowserAsync("https://mojosms.com/credits");
            }}
            title="Credit"
            titleStyle={{ fontWeight: "500" }}
          />
          <List.Item
            onPress={async () => {
              // Linking.openURL("https://mojosms.com/terms");
              await WebBrowser.openBrowserAsync("https://mojosms.com/faq");
            }}
            title="FAQ"
            titleStyle={{ fontWeight: "500" }}
          />
          <List.Item
            onPress={() => {
              Linking.openURL("https://youtube.com");
            }}
            title="Tutoriels"
            titleStyle={{ fontWeight: "500" }}
          />
          <List.Item
            onPress={() => {
              Linking.openURL(
                "https://api.whatsapp.com/message/O7XLZYOQMDDNO1"
              );
            }}
            title="Support"
            titleStyle={{ fontWeight: "500" }}
          />
        </View>
        <Text style={{ textAlign: "center" }}>MOJO SMS v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const CompteScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="account"
        component={AccountView}
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR },
          headerTitleStyle: { color: "white" },
          title: "Parametre",
        }}
      />
    </Stack.Navigator>
  );
};

export default CompteScreen;
