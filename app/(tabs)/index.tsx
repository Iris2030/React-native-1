import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../../Screens/HomeScreen';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import StackNavigator from '@/navigation/StackNavigator';

export default function App() {
  return (
    <NavigationContainer independent={true}>
      {/* <StackNavigator/> */}
      <BottomTabNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});