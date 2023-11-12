import { Pressable, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";

export const Button = ({ children, style, onPress }) => {
  const _pressableButton = ({ pressed }) => {
    if (pressed) {
      return [styles.button, style, { opacity: 0.75 }];
    }
    return [styles.button, style];
  };

  return (
    <Pressable style={_pressableButton} onPress={onPress}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: GlobalStyles.colors.primary700,
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 10,
  },
  buttonText: {
    color: GlobalStyles.colors.primary100,
    textAlign: 'center',
  },
});
