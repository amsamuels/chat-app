import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UpdateChatDetails = async (
  chat_id,
  data,
  setSuccessfullyUpdatedChat,
  setErrorUpdatingChat
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });
    if (res?.status === 200) {
      setSuccessfullyUpdatedChat(true);
      console.log('Update chat details: Successfully updated chat details');
    } else if (res?.status === 401) {
      setErrorUpdatingChat(true);
      console.log('Failed to update chat details: Unauthorized');
    }
  } catch (error) {
    console.error('Failed to update chat details: Unauthorized', error);
    setErrorUpdatingChat(true);
    throw error;
  }
};
export default UpdateChatDetails;
