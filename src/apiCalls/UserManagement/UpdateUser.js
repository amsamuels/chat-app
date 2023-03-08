import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UpdateUser = async (data, setAccountUpdated, setUpdateError) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
    console.log(data);
    const res = await fetch(`${API_URL}user/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });
    if (res?.status === 200) {
      setAccountUpdated(true);
      console.log('update user: Successfully updated user');
    } else if (res?.status === 401) {
      setUpdateError(true);
      console.log('update user: Unauthorized');
    }
  } catch (error) {
    console.error('Failed to update user: Unauthorized', error);
    setUpdateError(true);
    throw error;
  }
};
export default UpdateUser;
