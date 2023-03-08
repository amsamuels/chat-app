import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UnblockContact = async (
  id,
  setSuccessfullyUnblocked,
  setErrorBlocking
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}user/${id}/block`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Unblock Contact: Successfully Unblock Contact');
      setSuccessfullyUnblocked(true);
    } else if (res?.status === 400) {
      console.log('Unblock Contact: Failed to Unblock Contact');
      setErrorBlocking(true);
    }
  } catch (error) {
    console.error('Failed to Unblock Contact:', error);
    setErrorBlocking(true);
    throw error;
  }
};

export default UnblockContact;
