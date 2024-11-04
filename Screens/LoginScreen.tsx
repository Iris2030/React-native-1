import { FC, useCallback, useEffect, useState } from "react";
import { Alert, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { colors } from "../styles/global";
import Input from "../components/Input";
import Button from "../components/Button";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../navigation/StackNavigator";
import { loginDB } from "../utils/auth";
import { useDispatch, useSelector } from "react-redux";

const { width: SCREEN_WIDTH } = Dimensions.get("screen");

type LoginScreenProps = NativeStackScreenProps<StackParamList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isEmailWrongs, setIsEmailWrongs] = useState(false); 
  const [isPasswordWrongs, setIsPasswordWrongs] = useState(false); 

  const dispatch = useDispatch();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError('');
    setIsEmailWrongs(false);
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError('Невірний формат електронної пошти');
      setIsEmailWrongs(true); 
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!value) {
      setPasswordError('Пароль не може бути пустим');
      setIsPasswordWrongs(true)
    } else {
      setPasswordError('');
      setIsPasswordWrongs(false)
    }
  };

  const handlePasswordBlur = () => {
    
    if (!password) {
      setPasswordError('Пароль не може бути пустим');
      setIsPasswordWrongs(true)
    }
  };

  const showPassword = () => {
    setIsPasswordVisible(prev => !prev);
  };

const onLogin = async () => {
  if (validateEmail(email) && password) {
    try {
      console.log(email,'email');
      console.log(password,'password');

      await loginDB({ email, password }, dispatch);
      // Only navigate to 'Home' after a successful login
      navigation.navigate('Home');
    } catch (err) {
      console.error('Login error:', err); // Log errors if login fails
    }
  } else {
    if (!validateEmail(email)) {
      setEmailError('Невірний формат електронної пошти');
      setIsEmailWrongs(true);
    }
    if (!password) {
      setPasswordError('Пароль не може бути пустим');
      setIsPasswordWrongs(true);
    }
  }
};

  const onSignUp = () => {
    navigation.navigate("Signup", { userEmail: email });
  };

  const showButton = (
    <TouchableOpacity onPress={showPassword}>
      <Text style={[styles.baseText, styles.passwordButtonText]}>
        Показати
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Image
          source={require("../assets/images/background.jpeg")}
          resizeMode="cover"
          style={styles.image}
        />

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? 'padding' : 'height'}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Увійти</Text>

            <View style={[styles.innerContainer, styles.inputContainer]}>
              <Input
                value={email}
                autofocus={true}
                placeholder="Адреса електронної пошти"
                onTextChange={handleEmailChange}
                onBlur={handleEmailBlur}  
                isEmailWrongs={isEmailWrongs}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

              <Input
                value={password}
                placeholder="Пароль"
                rightButton={showButton}
                outerStyles={styles.passwordButton}
                onTextChange={handlePasswordChange}
                onBlur={handlePasswordBlur}  
                secureTextEntry={isPasswordVisible}
                isPasswordWrongs={isPasswordWrongs}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={[styles.innerContainer, styles.buttonContainer]}>
              <Button onPress={onLogin}>
                <Text style={[styles.baseText, styles.loginButtonText]}>
                  Увійти
                </Text>
              </Button>

              <View style={styles.signUpContainer}>
                <Text style={[styles.baseText, styles.passwordButtonText]}>
                  Немає акаунту?
                  <TouchableWithoutFeedback onPress={onSignUp}>
                    <Text style={styles.signUpText}> Зареєструватися</Text>
                  </TouchableWithoutFeedback>
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  innerContainer: {
    gap: 16,
  },
  inputContainer: {
    marginTop: 32,
  },
  buttonContainer: {
    marginTop: 42,
  },
  image: {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: "100%",
    width: "100%",
  },
  formContainer: {
    width: SCREEN_WIDTH,
    height: "55%",
    backgroundColor: colors.white,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "500",
    lineHeight: 36,
    textAlign: "center",
  },
  baseText: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 18,
  },
  loginButtonText: {
    color: colors.white,
    textAlign: "center",
  },
  passwordButtonText: {
    color: colors.blue,
  },
  passwordButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    textDecorationLine: "underline",
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
