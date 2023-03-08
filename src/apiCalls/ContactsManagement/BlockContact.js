import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const BlockContact = async (id, setContactBlocked, setErrorBlocking) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}user/${id}/block`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Block Contact: Successfully Blocked Contact');
      setContactBlocked(true);
    } else if (res?.status === 400) {
      console.log('Block Contact: Failed to Block Contact');
      setErrorBlocking(true);
    }
  } catch (error) {
    console.error('Failed to Block Contact:', error);
    setErrorBlocking(true);
    throw error;
  }
};

export default BlockContact;
