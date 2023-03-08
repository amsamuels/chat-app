import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GetUser = async () => {
  const token = await AsyncStorage.getItem('@token');
  const id = await AsyncStorage.getItem('@id');
  const res = await fetch(`${API_URL}user/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Authorization': token,
    },
  });
  const data = await res.json();
  if (res?.status === 200) {
    console.log('get user: Successfully got user');
    return data;
  } else {
    console.log('get user: Failed to get user');
  }
};

export default GetUser;
