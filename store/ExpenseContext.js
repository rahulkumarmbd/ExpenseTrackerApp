import axios from "axios";
import { createContext, useState, useEffect, useContext } from "react";
import { FIREBASE_URL, FORMAT } from "../keys";
import { AuthContext } from "./AuthContext";

const initialState = {
  expenses: [],
  addExpense: async () => {},
  deleteExpense: async () => {},
  updateExpense: async () => {},
};

export const ExpenseContext = createContext(initialState);

export const ExpenseContextProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchingError, setFetchingError] = useState();
  const { token } = useContext(AuthContext);

  const fetchExpenses = async () => {
    try {
      const { data } = await axios.get(
        FIREBASE_URL + FORMAT + "?auth=" + token
      );
      if (!data) return;
      const ids = Object.keys(data);
      const expenses = ids.map((id) => ({ ...data[id], id }));
      setExpenses(expenses);
      setFetchingError(null);
    } catch (e) {
      console.log("Error fetching",e.message);
      throw new Error("Could not fetch expenses!");
    }
  };

  const handleFetchExpenses = async () => {
    setIsFetching(true);
    try {
      await fetchExpenses();
    } catch (e) {
      setFetchingError(e.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (token) {
      handleFetchExpenses();
    }
  }, [token]);

  const addExpense = async (newExpense) => {
    setIsFetching(true);
    try {
      await axios.post(FIREBASE_URL + FORMAT + "?auth=" + token, newExpense);
      await fetchExpenses();
    } catch (e) {
      console.log("=== ERROR ===",e);
      throw new Error("Couldn't add expense");
    } finally {
      setIsFetching(false);
    }
  };

  const deleteExpense = async (expenseId) => {
    setIsFetching(true);
    try {
      await axios.delete(
        `${FIREBASE_URL}/${expenseId + FORMAT}` + "?auth=" + token
      );
      await fetchExpenses();
    } catch (e) {
      throw new Error("Couldn't delete expense");
    } finally {
      setIsFetching(false);
    }
  };

  const updateExpense = async (expenseId, updatedExpense) => {
    setIsFetching(true);
    try {
      await axios.put(
        `${FIREBASE_URL}/${expenseId + FORMAT}` + "?auth=" + token,
        updatedExpense
      );
      await fetchExpenses();
    } catch (e) {
      throw new Error("Couldn't update expense");
    } finally {
      setIsFetching(false);
    }
  };

  const value = {
    expenses,
    isFetching,
    fetchingError,
    addExpense,
    deleteExpense,
    updateExpense,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
