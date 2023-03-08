import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddContact = async (id, setContactAdded, setAddError) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}user/${id}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Contact: Successfully Added contact');
      setContactAdded(true);
    } else if (res?.status === 400) {
      console.log('Contact: Failed to add contact');
      setAddError(true);
    }
  } catch (error) {
    console.error('Failed to create user:', error);
    setAddError(true);
    throw error;
  }
};

export default AddContact;
