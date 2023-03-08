import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './src/navigations';
import Toast from 'react-native-toast-message';
import './App.css';

export default function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
      <Toast />
    </NavigationContainer>
  );
}
