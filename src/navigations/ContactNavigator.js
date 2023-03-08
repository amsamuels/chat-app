import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Contacts, AddNewContact } from '../screens';
import { ROUTES } from '../constants';

const Stack = createStackNavigator();

function ContactStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.CONTACTS}
        component={Contacts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ADD_NEW_CONTACT}
        component={AddNewContact}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default ContactStack;
