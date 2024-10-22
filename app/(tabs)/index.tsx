import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegistrationScreen from '../../Screens/RegistrationScreen';
import LoginScreen from '../../Screens/LoginScreen';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <RegistrationScreen />
      {/* <LoginScreen /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});