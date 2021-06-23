import * as React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  SectionList,
  TextInput,
} from "react-native";

import { Text, Checkbox } from "react-native-paper";
import { BACKGROUND_COLOR, IContact, PRIMARY_COLOR } from "../../utils";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";

import AtozSectionItem from "./Item";
interface IAtozData {
  key: string;
  [otherKey: string]: any;
}

interface ISectionStructure {
  title: string;
  data: IContact[];
}

type IAtozOnSelectionChanged = (selection: IContact[]) => void;

interface IAtozProps {
  data: IAtozData[];
  showSearch?: boolean;
  isSelectable?: boolean;
  onSelectionChanged?: IAtozOnSelectionChanged;
  itemClickAction?: any;
  initialSelectedContacts?: IContact[];
}

type TSectionConvertor = (data: IAtozData[]) => ISectionStructure[];

const sectionConvertor: TSectionConvertor = (data) => {
  let sections: { [args: string]: any } = {};
  /**
   * PUT IT FROM A TO Z
   */
  const _sortedData = data.sort((a, b) =>
    a.key.toLocaleLowerCase().localeCompare(b.key.toLocaleLowerCase())
  );

  /**
   * CREATING THE SECTION STRUCTURE
   */

  _sortedData.forEach(({ key, ...contact }) => {
    //referencing the index as sections[A-Z]
    const section: IContact[] = sections[key[0].toUpperCase()];

    //if the section exist we can push
    if (section) {
      section.push(contact as IContact);
    }

    // if the section does not exist we create it with the first value
    else {
      sections[key[0].toUpperCase()] = [contact as IContact];
    }
  });

  /**
   * WE CAN NOW RETURN THE CORRECT STRUCTURE
   */
  return Object.keys(sections)
    .filter((key) => key.trim().length > 0)
    .map((key) => ({
      title: key,
      data: sections[key],
    }));
};

const Atoz: React.FC<IAtozProps> = ({
  data,
  showSearch = false,
  isSelectable = false,
  onSelectionChanged,
  itemClickAction,
  initialSelectedContacts,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const navigation = useNavigation();
  /**
   * TO FILTER DATA USING SEARCH BAR
   */
  const [query, setQuery] = React.useState<string>("");

  /**
   * TO SELECT ELEMENT
   */
  const [selectedData, setSelectedData] = React.useState<IContact[]>(
    initialSelectedContacts || []
  );

  /**
   * GENERATING STRUCTURE
   */
  const filteredData = data.filter((_) => _.key.includes(query));
  const STRUCTURE = sectionConvertor(filteredData);

  const allSelected: boolean = data.length === selectedData.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedData([]);
    } else {
      STRUCTURE.map((e) => e.data);
      setSelectedData([...filteredData.map(({ key, ...e }) => e as IContact)]);
    }
  };

  React.useEffect(() => {
    console.log(selectedData);
    if (onSelectionChanged) {
      onSelectionChanged(selectedData);
      console.log(selectedData);
    }
  }, [selectedData]);

  return (
    <SafeAreaView style={styles.mainContainerStyle}>
      {showSearch && (
        <TextInput
          autoCorrect={false}
          placeholder="Rechercher dans contact..."
          placeholderTextColor="#555"
          style={{
            backgroundColor: "rgba(0,0,0,0.075)",
            margin: 15,
            marginBottom: 10,
            padding: 15,
            borderRadius: 15,
            fontSize: 16,
          }}
          onChangeText={(value) => setQuery(value)}
        />
      )}
      {isSelectable && (
        <View
          style={{
            paddingHorizontal: 7,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Checkbox.Android
            status={
              allSelected
                ? "checked"
                : selectedData.length === 0
                ? "unchecked"
                : "indeterminate"
            }
            color={PRIMARY_COLOR}
            onPress={toggleSelectAll}
            style={{ marginRight: 10 }}
          />
          <TouchableOpacity onPress={toggleSelectAll}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", color: PRIMARY_COLOR }}
            >
              Tout {allSelected ? "deselectionner" : "selectionner"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {/* // TODO SCROLL ON SECTION MOVE & HIGH;IGHT CHAT */}
      {/* <View
        style={{
          position: "absolute",
          height: "100%",
          right: 0,

          zIndex: 10,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            ...HARD_SHADOW,
            backgroundColor: "black",
            shadowColor: PRIMARY_COLOR,
            shadowOffset: { width: -5, height: 5 },
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ height: 45 * STRUCTURE.length, maxHeight: 400 }}
          >
            {STRUCTURE.map((e) => (
              <TouchableOpacity key={e.title} style={{ padding: 15 }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 15,
                    lineHeight: 15,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {e.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View> */}
      <SectionList
        showsVerticalScrollIndicator={false}
        style={styles.sectionStyle}
        sections={STRUCTURE}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <AtozSectionItem
            navigation={navigation}
            itemClickAction={itemClickAction}
            showActionSheetWithOptions={showActionSheetWithOptions}
            isSelectable={isSelectable}
            selectedContacts={selectedData}
            setSelectedContacts={setSelectedData}
            isSelected={
              selectedData.filter((data) => data.id === item.id).length > 0
            }
            {...item}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.HeaderStyle}>{title}</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Atoz;

const styles = StyleSheet.create({
  mainContainerStyle: { flex: 1 },
  sectionStyle: { flex: 1 },
  HeaderStyle: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    backgroundColor: BACKGROUND_COLOR,
    fontSize: 15,
    color: PRIMARY_COLOR,
    fontWeight: "600",
    margin: 0,
  },
});
