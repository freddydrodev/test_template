import * as React from "react";
import {
  TextInput,
  TextInputProps,
  View,
  ScrollView,
  Platform,
} from "react-native";
import { List, Text } from "react-native-paper";
import { KEYWORDS, PRIMARY_COLOR } from "../utils";

// TODO use this instead
const suggestions = [
  { id: "fullname", name: "Nom Complet" },
  { id: "firstname", name: "Prenom" },
  { id: "lastname", name: "Nom de Famille" },
  { id: "email", name: "Address Email" },
  { id: "gender", name: "Denomination" },
  { id: "companyName", name: "ma compagnie" },
  { id: "website", name: "mon site web" },
];

interface MentionProps extends TextInputProps {}

interface IMentionPart {
  value: string;
  isFocused: boolean;
  isKeyword: boolean;
  isHasTag: boolean;
  selection: ITextInputSelection;
}

interface ITextInputSelection {
  start: number;
  end: number;
}

type TMentionPartsGenerator = (
  text: string,
  keywords: string[],
  selection: ITextInputSelection
) => IMentionPart[];

const getLastPartEnd = (parts: string[], index: number) => {
  let end: number = 0;

  if (index > 0) {
    end = parts
      .filter((_, i) => i < index)
      .reduce((prevVal, currentValue) => {
        return prevVal + currentValue.length;
      }, 0);
  }

  return end + index;
};

const mentionPartsGenerator: TMentionPartsGenerator = (
  text,
  keywords,
  selection
) => {
  let parts: IMentionPart[] = [];

  if (text && text.trim().length > 0) {
    const textAsArray = text.split(" ");

    parts = textAsArray.map((el, index) => {
      const start = getLastPartEnd(textAsArray, index);
      const end = start + el.length;
      const isHasTag = el.startsWith("@");

      return {
        value: el,
        isFocused: selection.start >= start && selection.end <= end && isHasTag,
        isHasTag,
        isKeyword: keywords.includes(el),
        selection: {
          start,
          end,
        },
      };
    });
  }

  return parts;
};

const Mention: React.FC<MentionProps> = ({
  style,
  onChangeText,
  ...textInputProps
}) => {
  const [text, setText] = React.useState<string>("");
  const inputRef = React.useRef<TextInput>();
  const [selection, setSelection] = React.useState<ITextInputSelection>({
    start: 0,
    end: 0,
  });

  const mentionParts = mentionPartsGenerator(
    text,
    KEYWORDS.map((e) => e.label),
    selection
  );

  const focusedEl: IMentionPart = mentionParts
    .filter((e) => e.isFocused)
    .reduce((_, b) => b, {
      value: "",
      isFocused: true,
      isKeyword: false,
      selection: { end: 0, start: 0 },
      isHasTag: false,
    });

  return (
    <View style={style}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: 150 }}
      >
        {KEYWORDS.map((e) => e.label)
          .filter((el) => {
            return (
              el.includes(focusedEl.value) &&
              text.trim().length > 0 &&
              focusedEl.value !== "" &&
              focusedEl.value !== el
            );
          })
          .map((key) => (
            <List.Item
              onPress={() => {
                if (focusedEl.value !== "") {
                  console.log(mentionParts.indexOf(focusedEl));
                  const _text = mentionParts
                    .map((e, i) => {
                      if (mentionParts.indexOf(focusedEl) === i) {
                        e.value = key;
                      }

                      return e.value;
                    })
                    .join(" ");

                  setText(_text);
                  onChangeText(_text);

                  inputRef.current.focus();
                }
              }}
              key={key}
              title={key}
              titleStyle={{
                color: PRIMARY_COLOR,
                letterSpacing: 1,
                fontSize: 14,
              }}
              style={{
                borderBottomColor: "#eee",
                borderBottomWidth: 1,
                padding: 0,
                paddingVertical: 5,
              }}
            />
          ))}
      </ScrollView>
      <TextInput
        style={{
          padding: 10,
          fontSize: 16,
          maxHeight: 100,
          marginTop: 5,
        }}
        ref={inputRef}
        onSelectionChange={(e) => {
          setSelection(e.nativeEvent.selection);
        }}
        multiline
        {...textInputProps}
        onChangeText={(e) => {
          setText(e);
          onChangeText(e);
        }}
        value={Platform.OS !== "web" ? null : text}
      >
        {mentionParts.length > 0 && Platform.OS !== "web" && (
          <Text>
            {mentionParts.map((part, index) => {
              return (
                <Text
                  onPress={(e) => {
                    console.log(e.target.toString());
                  }}
                  key={index}
                  style={{
                    color:
                      part.isKeyword && part.isHasTag ? PRIMARY_COLOR : "black",
                  }}
                >
                  {part.value + (index < mentionParts.length - 1 ? " " : "")}
                </Text>
              );
            })}
          </Text>
        )}
      </TextInput>
    </View>
  );
};

export default Mention;
