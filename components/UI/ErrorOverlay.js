import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";

export const ErrorOverlay = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Error Occured!</Text>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.primary700,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    margin: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
