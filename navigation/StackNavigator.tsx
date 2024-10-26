import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack"; 

import LoginScreen from "../Screens/LoginScreen";
import SignupScreen from "../Screens/RegistrationScreen";
import BottomTabNavigator from "./BottomTabNavigator";

export type StackParamList = {
  Home: undefined;       
  Login: undefined;
  Signup: { userEmail?: string };
};

const Stack = createStackNavigator<StackParamList>();  

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;