import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GetContact = async () => {
  const token = await AsyncStorage.getItem('@token');
  const res = await fetch(`${API_URL}contacts`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-Authorization': token,
    },
  });
  const data = await res.json();
  if (res?.status === 200) {
    console.log('Get Contacts: Successfully got contacts list');
    return data;
  } else {
    console.log('Get Contacts: Failed to get contacts list');
  }
};

export default GetContact;
