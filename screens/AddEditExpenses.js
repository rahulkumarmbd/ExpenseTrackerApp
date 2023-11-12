import { useLayoutEffect, useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import { GlobalStyles } from "../constants/colors";
import { ExpenseContext } from "../store/ExpenseContext";
import { IconButton } from "../components/UI/IconButton";
import { validateDate } from "../util/validate";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { ErrorOverlay } from "../components/UI/ErrorOverlay";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowAlert: true,
    };
  },
  handleError: (id, error) => {
    console.log("===", id, error);
  },
  handleSuccess: (id) => {
    console.log("===", id);
  },
});

const getInitialState = () => {
  return {
    amount: "",
    date: "",
    description: "",
  };
};

const errorInitialState = () => {
  return {
    isValidAmount: true,
    isValidDate: true,
    isValidDescription: true,
  };
};

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export const AddEditExpenses = ({ navigation, route }) => {
  const entity = route.params?.entity;
  const expenseId = route.params?.expenseId;
  const isAddEntity = entity === "Add";
  const [expoPushToken, setExpoPushToken] = useState("");

  const { expenses, addExpense, updateExpense, deleteExpense, isFetching } =
    useContext(ExpenseContext);
  const [expense, setExpense] = useState(() => {
    if (!isAddEntity) {
      const expense = expenses.find((expense) => expense.id === expenseId);
      return { ...expense, date: expense.date.slice(0, 10) };
    }
    return getInitialState();
  });

  const [errors, setErrors] = useState(errorInitialState);
  const [firebaseError, setFirebaseError] = useState();

  const validateInputs = (expense) => {
    const isValidAmount = expense.amount.length !== 0 && !isNaN(expense.amount);
    const isValidDate = validateDate(expense.date);
    const isValidDescription = expense.description.length > 0;

    if (!isValidAmount || !isValidDate || !isValidDescription) {
      setErrors({ isValidAmount, isValidDate, isValidDescription });
    } else {
      setErrors({
        isValidAmount: true,
        isValidDate: true,
        isValidDescription: true,
      });
    }

    return isValidAmount && isValidDate && isValidDescription;
  };

  const handleInputChange = (name, value) => {
    setExpense((prevState) => {
      const changedExpense = { ...prevState, [name]: value };

      validateInputs(changedExpense);
      return changedExpense;
    });
  };

  const addNewExpense = async () => {
    if (!validateInputs(expense)) return;

    try {
      await addExpense({
        ...expense,
        date: new Date(expense.date),
        amount: Number(expense.amount).toFixed(2),
      });
      navigation.goBack();
    } catch (e) {
      setFirebaseError(e.message);
    }
  };

  const updateEditedExpense = async () => {
    try {
      await updateExpense(expenseId, {
        ...expense,
        date: new Date(expense.date),
        amount: Number(expense.amount).toFixed(2),
      });
      navigation.goBack();
    } catch (e) {
      setFirebaseError(e.message);
    }
  };

  const handleDeleteExpense = async () => {
    try {
      await deleteExpense(expenseId);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You have successfully deleted",
          body: expense.description,
          data: { userName: "Rahul" },
        },
        trigger: {
          seconds: 5,
        },
      });
      navigation.goBack();
    } catch (e) {
      setFirebaseError(e.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isAddEntity ? "Add Expense" : "Edit Expense",
    });
  }, []);

  useEffect(() => {
    validateInputs(expense);
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        const userName = notification.request.content.data.userName;
        console.log("==== received", userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const userName = response.notification.request.content.data.userName;
        console.log("==== response", userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  const sendPushNotificationHandler = () => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "ExponentPushToken[6tQSfjO_sEMz8DoHHI7bVf]",
        title: "Learning Push Notification",
        body: "This is my Push Notification",
      }),
    });
  };

  if (expoPushToken) {
    console.log("=== expoPushToken", expoPushToken);
  }

  if (firebaseError && !isFetching) {
    return <ErrorOverlay message={firebaseError} />;
  }

  if (isFetching) {
    return <LoadingOverlay />;
  }

  return (
    <View style={[styles.flex, styles.root]}>
      <View>
        <Text style={styles.title}>Your Expense</Text>
      </View>
      <View style={styles.dateContainer}>
        <Input
          label="Amount"
          style={styles.flex}
          isValid={errors.isValidAmount}
          textInputConfig={{
            placeholder: "Enter Amount",
            placeholderTextColor: GlobalStyles.colors.primary800,
            keyboardType: "number-pad",
            value: String(expense.amount),
            onChangeText: (text) => handleInputChange("amount", text),
          }}
        />
        <Input
          label="Date"
          style={styles.flex}
          isValid={errors.isValidDate}
          textInputConfig={{
            placeholder: "YYYY-MM-DD",
            placeholderTextColor: GlobalStyles.colors.primary800,
            value:
              typeof expense.date === "object"
                ? expense.date.toISOString().slice(0, 10)
                : expense.date,
            maxLength: 10,
            onChangeText: (text) => handleInputChange("date", text),
          }}
        />
      </View>
      <View>
        <Input
          label="Description"
          isValid={errors.isValidDescription}
          textInputConfig={{
            placeholder: "Enter Description",
            placeholderTextColor: GlobalStyles.colors.primary800,
            multiline: true,
            value: expense.description,
            onChangeText: (text) => handleInputChange("description", text),
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          style={[styles.flex, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          Cancel
        </Button>
        <Button
          style={[styles.flex]}
          onPress={isAddEntity ? addNewExpense : updateEditedExpense}
        >
          {isAddEntity ? "Add" : "Edit"}
        </Button>
      </View>
      <Button onPress={sendPushNotificationHandler}>Push Notification</Button>
      {!isAddEntity && (
        <View style={styles.trashContainer}>
          <IconButton
            name="trash-outline"
            color={GlobalStyles.colors.primary100}
            size={34}
            onPress={handleDeleteExpense}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  flex: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    margin: 30,
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginHorizontal: 30,
    justifyContent: "space-around",
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  trashContainer: {
    alignItems: "center",
    borderTopColor: GlobalStyles.colors.primary100,
    paddingTop: 20,
    borderTopWidth: 4,
    marginHorizontal: 30,
  },
});
