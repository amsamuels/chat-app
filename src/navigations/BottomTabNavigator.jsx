import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../constants';
import HomeStack from './HomeNavigator';
import SettingStack from './SettingNavigator';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === ROUTES.MAIN) {
            return (
              <Ionicons name="md-chatbubbles-sharp" size={28} color="black" />
            );
          } if (route.name === ROUTES.SETTING_STACK) {
            return <Ionicons name="md-settings" size={28} color="black" />;
          }
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.MAIN}
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name={ROUTES.SETTING_STACK}
        component={SettingStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabNavigator;
