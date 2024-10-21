import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const RegistrationScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [buttonRotation, setButtonRotation] = useState(new Animated.Value(0));

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const selectImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      rotateButton();
    }
  };

  const rotateButton = () => {
    Animated.timing(buttonRotation, {
      toValue: 43,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const removeImage = () => {
    setProfileImage(null);
    setButtonRotation(new Animated.Value(0));
  };

  const interpolatedRotation = buttonRotation.interpolate({
    inputRange: [0, 43],
    outputRange: ["0deg", "43deg"],
  });

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/3060bf968d92368179ce26a756ce4271.jpeg")}
          style={styles.backgroundImage}
        />

        <View style={styles.formContainer}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholder} />
            )}
            <TouchableOpacity
              style={[styles.addButton,
                {
                    borderColor: profileImage ? "#E8E8E8" : "#FF6C00",
                  },
              ]}
              onPress={profileImage ? removeImage : selectImage}
            >
              <Animated.Text
                style={[
                  styles.addButtonText,
                  {
                    transform: [{ rotate: interpolatedRotation }],
                    color: profileImage ? "#E8E8E8" : "#FF6C00",
                    top:  profileImage ? -5 : -6,
                    left: profileImage ? 6 : 5,
                  },
                ]}
              >
                +
              </Animated.Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerText}>Реєстрація</Text>

          <TextInput
            style={styles.input}
            placeholder="Логін"
            placeholderTextColor="#BDBDBD"
          />
          <TextInput
            style={styles.input}
            placeholder="Адреса електронної пошти"
            keyboardType="email-address"
            placeholderTextColor="#BDBDBD"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Пароль"
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#BDBDBD"
            />
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Text style={styles.toggleText}>
                {passwordVisible ? "Приховати" : "Показати"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Зареєструватися</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.loginLink}>Вже є акаунт? Увійти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  formContainer: {
    position: "relative",
    marginTop: 550,
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  profileImageContainer: {
    position: "absolute",
    top: -60,
    left: "50%",
    transform: [{ translateX: -50 }],
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  profileImage: {
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  placeholder: {
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
  },
  addButton: {
    position: "absolute",
    right: -15,
    bottom: 14,
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF6C00",
  },
  addButtonText: {
    fontSize: 30,
    position: "absolute",
    top: -6,
    left: 5,
    fontWeight: "100",
  },
  headerText: {
    fontFamily: "Roboto-Bold",
    fontSize: 30,
    marginBottom: 32,
    marginTop: 92,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 16,
  },
  passwordInput: {
    width: "100%",
    height: 50,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 80,
  },
  toggleButton: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  toggleText: {
    color: "blue",
    fontSize: 14,
  },
  registerButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#ff7f00",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    marginBottom: 16,
  },
  registerButtonText: {
    fontFamily: "Roboto-Regular",
    color: "white",
    fontSize: 16,
  },
  loginLink: {
    color: "#1B4371",
    textDecorationLine: "none",
  },
});

export default RegistrationScreen;
