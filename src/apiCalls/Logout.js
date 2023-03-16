import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LogOut = async (props) => {
  const token = await AsyncStorage.getItem('@token');
  const res = await fetch(`${API_URL}logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Authorization': token,
    },
  });
  if (res?.status === 200) {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@id');
    console.log('Logout: Successfully logged out');
  } else if (res?.status === 401) {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@id');
    console.log('Logout: Unauthorized');
  }
};

export default LogOut;
