import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const DeleteMessage = async (
  chat_id,
  message_id,
  setDeleteMessageSuccess,
  setDeleteMessageError
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}/message/${message_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      setDeleteMessageSuccess(true);
      console.log('Delete Message: Successfully Deleted Message');
    } else if (res?.status === 401) {
      setDeleteMessageError(true);
      console.log('Delete Message: Unauthorized');
    }
  } catch (error) {
    console.error('Delete Message Failed', error);
    setDeleteMessageError(true);
    throw error;
  }
};
export default DeleteMessage;
