import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MessageSummaryScreen from "./MessageSummaryScreen";
import { PRIMARY_COLOR } from "../utils/colors";
const Stack = createStackNavigator();

const MessageFlow = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="messageSummary"
        options={{
          headerStyle: { backgroundColor: PRIMARY_COLOR, borderWidth: 0 },
          headerTitleStyle: { fontSize: 14, letterSpacing: 1, color: "white" },
          title: "MOJO SMS",
        }}
        component={MessageSummaryScreen}
      />
    </Stack.Navigator>
  );
};

export default MessageFlow;
