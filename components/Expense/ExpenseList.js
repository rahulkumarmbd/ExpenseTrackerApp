import { FlatList } from "react-native";
import { ExpenseListItem } from "./ExpenseListItem";
import { useNavigation } from "@react-navigation/native";

export const ExpenseList = ({ expenses }) => {
  const navigation = useNavigation();

  const _renderItem = ({ item }) => {
    return (
      <ExpenseListItem
        {...item}
        onPress={() => {
          navigation.navigate("AddEditExpenses", {
            expenseId: item.id,
          });
        }}
      />
    );
  };

  return (
    <FlatList
      data={expenses}
      keyExtractor={(expense) => expense.id}
      renderItem={_renderItem}
    />
  );
};
