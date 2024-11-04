import { createStackNavigator } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack"; 
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

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
  const user = useSelector((state: RootState) => state.user.userInfo);

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        // Якщо користувач залогінений, показуємо головний екран
        <Stack.Screen name="Home" component={BottomTabNavigator} />
      ) : (
        // Якщо користувач не залогінений, показуємо екрани Login та Signup
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};


export default StackNavigator;