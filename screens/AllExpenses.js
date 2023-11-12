import { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { ExpenseHeader } from "../components/Expense/ExpenseHeader";
import { ExpenseList } from "../components/Expense/ExpenseList";
import { ErrorOverlay } from "../components/UI/ErrorOverlay";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/AuthContext";
import { ExpenseContext } from "../store/ExpenseContext";

export const AllExpenses = () => {
  const { expenses, isFetching, fetchingError } = useContext(ExpenseContext);
  const { token } = useContext(AuthContext);

  const totoalAmount = expenses.reduce(
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
        headerAmount={totoalAmount.toFixed(2)}
        headerText="Total"
      />
      <ExpenseList expenses={expenses} />
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
