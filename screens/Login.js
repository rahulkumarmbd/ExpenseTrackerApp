import { useState, useContext } from "react";
import { Alert } from "react-native";
import { AuthForm } from "../components/Auth/AuthForm";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/AuthContext";
import { login } from "../util/auth";

export const Login = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  const navigateToSignup = () => {
    navigation.replace("SignUp");
  };

  const handleSubmit = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (err) {
      Alert.alert(
        "Authentication failed",
        "could not log you in , please check your credentials and try again"
      );
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }

  return (
    <AuthForm
      submitButtonText="Log In"
      onTogglePress={navigateToSignup}
      onSubmit={handleSubmit}
    />
  );
};
