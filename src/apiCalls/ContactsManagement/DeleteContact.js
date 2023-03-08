import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deleteContact = async (id) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    console.log(id);
    const res = await fetch(`${API_URL}user/${id}/contact`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Contact: Successfully Deleted Contact');
      setContactAdded(true);
    } else if (res?.status === 400) {
      console.log('Contact: Failed to Deleted Contact');
      setAddError(true);
    }
  } catch (error) {
    console.error('Failed to Deleted Contact:', error);
    setAddError(true);
    throw error;
  }
};
export default deleteContact;
