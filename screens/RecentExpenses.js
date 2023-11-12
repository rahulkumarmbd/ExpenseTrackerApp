import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ExpenseHeader } from "../components/Expense/ExpenseHeader";
import { ExpenseList } from "../components/Expense/ExpenseList";
import { ErrorOverlay } from "../components/UI/ErrorOverlay";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/AuthContext";
import { ExpenseContext } from "../store/ExpenseContext";

export const RecentExpenses = () => {
  const { expenses, isFetching, fetchingError } = useContext(ExpenseContext);
  const { token } = useContext(AuthContext);

  const last7DaysExpenses = expenses.filter((expense) => {
    const today = new Date();
    const day7DaysAgo = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    return new Date(expense.date.slice(0, 10)) > day7DaysAgo;
  });

  const last7DaysExpensesAmount = last7DaysExpenses.reduce(
    (acc, expense) => acc + +expense.amount,
    0
  );

  if (token && fetchingError && !isFetching) {
    return <ErrorOverlay message={fetchingError} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.flex}>
      <ExpenseHeader
        headerAmount={last7DaysExpensesAmount.toFixed(2)}
        headerText="Last 7 Days"
      />
      <ExpenseList expenses={last7DaysExpenses} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
