import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Main, NewChat, ChatSceen, ChatSettings } from '../screens';
import { ROUTES } from '../constants';

const Stack = createStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.MAIN}
        component={Main}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.NEW_CHAT}
        component={NewChat}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.CHAT_SCREEN}
        component={ChatSceen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.ADD_USER_TO_CHAT}
        component={ChatSettings}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default ChatStack;
