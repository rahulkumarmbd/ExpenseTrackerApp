import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/colors";

export const ExpenseHeader = ({ headerText, headerAmount }) => {
  return (
    <View style={styles.expenseHeader}>
      <Text style={styles.expenseHeaderText}>{headerText}</Text>
      <Text style={[styles.expenseHeaderText, styles.amountHeaderText]}>
        ${headerAmount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseHeader: {
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
  },
  expenseHeaderText: {
    color: GlobalStyles.colors.primary500,
    fontSize: 18,
  },
  amountHeaderText: {
    fontWeight: "bold",
  },
});
