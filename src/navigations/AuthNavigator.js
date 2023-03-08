import React from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen, SignUp, Login, Contacts } from '../screens';
import { ROUTES } from '../constants';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();
// Navigator, Screen, Group

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.WELCOME}
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.REGISTER}
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.LOGIN}
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.HOME}
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
