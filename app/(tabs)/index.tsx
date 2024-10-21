import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegistrationScreen from '../../Screens/RegistrationScreen';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <RegistrationScreen />
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