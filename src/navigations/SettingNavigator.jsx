import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Settings, EditProfile, ViewBlockedUsers } from '../screens';
import { ROUTES } from '../constants';

const Stack = createStackNavigator();

function SettingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.SETTING}
        component={Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.EDIT_PROFILE}
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={ROUTES.VIEW_BLOCKED_USERS}
        component={ViewBlockedUsers}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default SettingStack;
