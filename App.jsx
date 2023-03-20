import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { AuthNavigator } from './src/navigations';
import './App.css';

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
      <Toast />
    </NavigationContainer>
  );
}
