import { useContext, useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RecentExpenses } from "./RecentExpenses";
import { AllExpenses } from "./AllExpenses";
import { AddEditExpenses } from "./AddEditExpenses";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/colors";
import { IconButton } from "../components/UI/IconButton";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { AuthContext } from "../store/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

const ExpensesScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const navigateToAddEditScreen = () => {
    navigation.navigate("AddEditExpenses", {
      entity: "Add",
    });
  };

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: GlobalStyles.colors.primary800 }}
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary700 },
        headerTintColor: "white",
        tabBarStyle: {
          backgroundColor: GlobalStyles.colors.primary700,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: GlobalStyles.colors.primary100,
        headerTitleStyle: { fontSize: 20 },
        headerLeft: ({ tintColor }) => (
          <IconButton
            name="exit"
            color={tintColor}
            size={30}
            onPress={logout}
            style={{ paddingLeft: 20 }}
          />
        ),
        headerRight: ({ tintColor }) => (
          <IconButton
            name="add-outline"
            color={tintColor}
            size={30}
            onPress={navigateToAddEditScreen}
            style={{ paddingRight: 20 }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: "Recent Expenses",
          tabBarLabel: "Recent",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="file-tray-full-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title: "All Expenses",
          tabBarLabel: "All Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="file-tray-stacked-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigators = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary700 },
        headerTintColor: "white",
        headerTitleStyle: { fontSize: 20 },
        contentStyle: { backgroundColor: GlobalStyles.colors.primary800 },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Expenses"
          component={ExpensesScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddEditExpenses"
          component={AddEditExpenses}
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const AuthNavigators = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary700 },
        headerTintColor: "white",
        headerTitleStyle: { fontSize: 20 },
        contentStyle: { backgroundColor: GlobalStyles.colors.primary800 },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            title: "Log In",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            title: "Sign Up",
            headerBackVisible: false,
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!isAuthenticated && <AuthNavigators />}
      {isAuthenticated && <AppNavigators />}
    </NavigationContainer>
  );
};

export const Root = () => {
  const [isFetchingToken, setIsFetchingToken] = useState(true);
  const { logout, authenticate } = useContext(AuthContext);

  const fetchToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        authenticate(token);
      }
    } catch (err) {
      logout();
    }
    setIsFetchingToken(false);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    const hideAsync = async () => {
      await SplashScreen.hideAsync();
    };

    if (!isFetchingToken) {
      hideAsync();
    }
  }, [isFetchingToken]);

  if (isFetchingToken) {
    return null;
  }

  return <Navigation />;
};
