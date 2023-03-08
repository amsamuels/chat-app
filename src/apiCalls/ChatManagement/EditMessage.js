import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const EditMessage = async (
  chat_id,
  message_id,
  data,
  setAccountUpdated,
  setUpdateError
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}/message/${message_id}`, {
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
      console.log('Edit Message: Successfully Edited Message');
    } else if (res?.status === 401) {
      setUpdateError(true);
      console.log('Failed to Edit Message: Unauthorized');
    }
  } catch (error) {
    console.error('Failed to Edit Message: Unauthorized', error);
    setUpdateError(true);
    throw error;
  }
};
export default EditMessage;
