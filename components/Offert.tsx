import * as React from "react";
import { View, ScrollView } from "react-native";
import { Avatar, Button, List, Text, Caption } from "react-native-paper";
import { PRIMARY_COLOR } from "../utils/colors";
import { HARD_SHADOW, IOffer } from "../utils";

interface IOfferProps extends IOffer {
  togglePayment: (offer: IOffer) => void;
}

const Offer: React.FC<IOfferProps> = ({
  smsCount = 10,
  price = 25,
  originalPrice = 25,
  items = [],
  togglePayment,
}) => {
  return (
    <View
      style={{
        backgroundColor: "white",
        height: 470,
        padding: 15,
        marginRight: 20,
        ...HARD_SHADOW,
      }}
    >
      <Text style={{ textAlign: "center", fontWeight: "900", fontSize: 21 }}>
        {smsCount} SMS
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontWeight: "300",
          fontSize: 30,
          paddingTop: 10,
          letterSpacing: 1,
        }}
      >
        {price * smsCount} FR CFA
      </Text>
      <Caption
        style={{
          textAlign: "center",
          textDecorationLine: "line-through",
          fontStyle: "italic",
          fontSize: 16,
        }}
      >
        {originalPrice * smsCount} FR CFA
      </Caption>
      <Button
        onPress={() => {
          togglePayment({ smsCount, price, originalPrice, items });
        }}
        mode="contained"
        contentStyle={{ padding: 5 }}
        style={{
          elevation: 0,
          marginTop: 20,
          marginBottom: 10,
          borderRadius: 0,
          ...HARD_SHADOW,
          shadowOffset: { width: 5, height: 5 },
        }}
      >
        Acheter
      </Button>

      <ScrollView>
        {items.map((el, i) => (
          <List.Item
            style={{ padding: 0, marginTop: 12 }}
            key={i}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="check-bold"
                color={PRIMARY_COLOR}
                size={25}
                style={{
                  backgroundColor: "rgba(241, 66, 98, 0.2)",
                  alignSelf: "center",
                  width: 25,
                  height: 25,
                  margin: 0,
                }}
              />
            )}
            title={el}
            titleStyle={{
              fontSize: 16,
              lineHeight: 20,
              opacity: 0.65,
              fontWeight: "600",
            }}
            titleNumberOfLines={2}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default Offer;
