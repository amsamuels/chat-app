import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GetBlockedContacts = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}blocked`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    const data = await res.json();
    if (res?.status === 200) {
      console.log(
        'Get Blocked Contacts : Successfully got blocked contacts list'
      );
      return data;
    } else {
      console.log('Get Blocked Contacts: Failed to get blocked contacts list');
    }
  } catch (error) {
    console.error('Failed to get blocked contacts list:', error);
    throw error;
  }
};

export default GetBlockedContacts;
