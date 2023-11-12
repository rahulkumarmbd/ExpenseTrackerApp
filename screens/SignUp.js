import { useState, useContext } from "react";
import { Alert } from "react-native";
import { AuthForm } from "../components/Auth/AuthForm";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { AuthContext } from "../store/AuthContext";
import { signup } from "../util/auth";

export const SignUp = ({ navigation }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  const navigateToSignup = () => {
    navigation.replace("Login");
  };

  const handleSignUp = async ({ email, password }) => {
    setIsAuthenticating(true);
    try {
      const token = await signup(email, password);
      authCtx.authenticate(token);
    } catch (err) {
      Alert.alert(
        "Authentication failed",
        "could not sign up , please check your credentials and try again"
      );
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return <LoadingOverlay />;
  }

  return (
    <AuthForm
      submitButtonText="Sign Up"
      onTogglePress={navigateToSignup}
      onSubmit={handleSignUp}
    />
  );
};
