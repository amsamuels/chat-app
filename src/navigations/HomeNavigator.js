import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../constants';
import ContactStack from './ContactNavigator';
import ChatStack from './ChatNavigator';
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.HOME_STACK}
        component={ChatStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.CONTACT_STACK}
        component={ContactStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
