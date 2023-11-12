import { StatusBar } from "expo-status-bar";
import { Root } from "./screens/Root";
import { AuthContextProvider } from "./store/AuthContext";
import { ExpenseContextProvider } from "./store/ExpenseContext";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <ExpenseContextProvider>
          <Root />
        </ExpenseContextProvider>
      </AuthContextProvider>
    </>
  );
}
