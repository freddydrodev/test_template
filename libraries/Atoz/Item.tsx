import * as React from "react";
import { List, Checkbox } from "react-native-paper";
import {} from "@react-navigation/native";

import { IContact, PRIMARY_COLOR } from "../../utils";
import { FIRESTORE } from "../../server/db";

interface IAtozSectionItemProps extends IContact {
  setSelectedContacts: any;
  isSelected: boolean;
  selectedContacts: IContact[];
  isSelectable: boolean;
  navigation: { navigate: any };
  itemClickAction?: any;
  showActionSheetWithOptions?: any;
}

export default class AtozSectionItem extends React.PureComponent<IAtozSectionItemProps> {
  render() {
    const {
      selectedContacts,
      isSelected,
      setSelectedContacts,
      isSelectable,
      itemClickAction,
      showActionSheetWithOptions,
      navigation,
      ...contact
    } = this.props;

    return (
      <List.Item
        left={(props) =>
          isSelectable ? (
            <Checkbox.Android
              {...props}
              status={isSelected ? "checked" : "unchecked"}
              color={PRIMARY_COLOR}
              onPress={() => {
                if (isSelected) {
                  setSelectedContacts(
                    [...selectedContacts].filter((el) => el.id !== contact.id)
                  );
                } else {
                  setSelectedContacts([...selectedContacts, contact]);
                }
              }}
            />
          ) : null
        }
        onPress={async () =>
          showActionSheetWithOptions(
            {
              options: ["Modifier", "Supprimer", "Annuler"],
              destructiveButtonIndex: 1,
              cancelButtonIndex: 2,
            },
            async (buttonIndex: number) => {
              if (buttonIndex === 0) {
                await navigation.navigate("createContact", { contact });
              } else if (buttonIndex === 1) {
                await FIRESTORE.collection("contacts").doc(contact.id).delete();
              }
            }
          )
        }
        style={{
          borderBottomColor: "rgba(0,0,0,0.075)",
          borderBottomWidth: 1,
          // paddingHorizontal: 20,
        }}
        title={this.props.firstName + " " + this.props.lastName}
        titleStyle={{ fontWeight: "700" }}
        description={
          this.props.number.length > 0 ? this.props.number.join(" / ") : "-"
        }
        descriptionStyle={{ letterSpacing: 1, lineHeight: 25 }}
      />
    );
  }
}
