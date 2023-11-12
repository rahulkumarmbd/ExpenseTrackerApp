import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { GlobalStyles } from "../../constants/colors";

export const ExpenseListItem = ({ amount, description, date, onPress }) => {
  const _pressableItem = ({ pressed }) => {
    if (pressed) {
      return [
        styles.pressableItem,
        {
          opacity: Platform.OS === "ios" ? 0.75 : 1,
        },
      ];
    }
    return styles.pressableItem;
  };

  return (
    <View style={styles.expenseItemContainer}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: "blue" }}
        style={_pressableItem}
      >
        <View>
          <Text style={[styles.expenseItemText, styles.expenseItemDescription]}>
            {description}
          </Text>
          <Text style={styles.expenseItemText}>{date.slice(0, 10)}</Text>
        </View>
        <View style={styles.expenseItemAmountContainer}>
          <Text style={[styles.expenseItemText, styles.expenseItemAmount]}>
            ${amount}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  expenseItemContainer: {
    backgroundColor: GlobalStyles.colors.primary400,
    marginHorizontal: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: GlobalStyles.colors.primary100,
    shadowOpacity: 0.75,
    shadowOffset: { height: 0, width: 0 },
    overflow: "hidden",
    borderRadius: 8,
  },
  pressableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  expenseItemText: {
    fontSize: 16,
    color: "white",
  },
  expenseItemDescription: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  expenseItemAmount: {
    fontWeight: "bold",
    color: GlobalStyles.colors.primary700,
    textAlign: "center",
  },
  expenseItemAmountContainer: {
    backgroundColor: "white",
    padding: 10,
    minWidth: 90,
    borderRadius: 6,
  },
});
