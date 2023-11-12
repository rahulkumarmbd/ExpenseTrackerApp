import { View, Text, TextInput, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";

export const Input = ({ label, textInputConfig, style, isValid }) => {
  let inputStyles = [styles.textInput, textInputConfig?.style];

  if (textInputConfig?.multiline) {
    inputStyles.push(styles.multiLineInput);
  }

  return (
    <View style={style}>
      <Text style={[styles.labelText, { color: isValid ? "white" : "red" }]}>
        {label}
      </Text>
      <TextInput
        {...textInputConfig}
        style={[
          inputStyles,
          {
            backgroundColor: isValid ? GlobalStyles.colors.primary100 : "white",
            color: isValid ? GlobalStyles.colors.primary800 : "red",
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelText: {
    paddingHorizontal: 8,
  },
  textInput: {
    padding: 10,
    margin: 10,
    borderRadius: 4,
    fontSize: 15,
  },
  multiLineInput: {
    paddingTop: 10,
    minHeight: 200,
    textAlignVertical: "top",
  },
});
