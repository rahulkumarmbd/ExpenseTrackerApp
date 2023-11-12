import { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { GlobalStyles } from "../../constants/colors";
import { emailValidator, passwordValidator } from "../../constants/validators";

const getInitialCredentials = () => {
  return {
    email: "",
    password: "",
  };
};

const errorInitialState = () => {
  return {
    isEmailValid: true,
    isPasswordValid: true,
  };
};

const NOOP = () => {};

export const AuthForm = ({
  onSubmit = NOOP,
  submitButtonText = "",
  onTogglePress = NOOP,
}) => {
  const [authCredentials, setAuthCredentials] = useState(getInitialCredentials);
  const [errors, setErrors] = useState(errorInitialState);

  const validateInputs = ({ email, password }) => {
    const isEmailValid = emailValidator.test(email);
    const isPasswordValid = passwordValidator.test(password);
    setErrors({
      isEmailValid,
      isPasswordValid,
    });

    return isEmailValid && isPasswordValid;
  };

  const handleInputChange = (entity, text) => {
    setAuthCredentials((prevAuthCredentials) => ({
      ...prevAuthCredentials,
      [entity]: text,
    }));
  };

  const authenticate = () => {
    if (!validateInputs(authCredentials)) return;

    onSubmit(authCredentials);
  };

  const toggleAuthButton = (
    <Pressable style={styles.toggleButtonContainer} onPress={onTogglePress}>
      <Text style={styles.toggleButton}>
        {submitButtonText === "Log In" ? "Sign Up" : "Log In"}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Input
          label="Email"
          isValid={errors.isEmailValid}
          textInputConfig={{
            onChangeText: (text) => handleInputChange("email", text),
            placeholderTextColor: GlobalStyles.colors.primary800,
            autoCapitalize: "none",
            placeholder: "Enter your email",
            autoCorrect: false,
          }}
        />
        <Input
          label="Password"
          isValid={errors.isPasswordValid}
          textInputConfig={{
            onChangeText: (text) => handleInputChange("password", text),
            placeholderTextColor: GlobalStyles.colors.primary800,
            autoCapitalize: "none",
            placeholder: "Enter your password",
            autoCorrect: false,
          }}
        />
        <Button onPress={authenticate}>{submitButtonText}</Button>
        <View style={styles.toggleAuthContainer}>
          <View>
            <Text style={styles.toggleAuthText}>
              {submitButtonText === "Log In"
                ? "Don't have account ?"
                : "Already have an account?"}
            </Text>
          </View>
          {toggleAuthButton}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: GlobalStyles.colors.primary500,
    padding: 20,
    margin: 20,
    borderRadius: 6,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleAuthText: {
    textAlign: "center",
    color: "white",
  },
  toggleButtonContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginLeft: 4,
  },
  toggleButton: {
    textAlign: "center",
    color: "white",
  },
  toggleAuthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
});
