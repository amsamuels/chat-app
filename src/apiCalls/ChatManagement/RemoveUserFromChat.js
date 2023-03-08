import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RemoveUserFromChat = async (
  chat_id,
  user_id,
  setChatUserAdded,
  setUserInChat,
  setErrorAddingUser
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}/user/${user_id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Remove User from Chat: Successfully removed user');
      setChatUserAdded(true);
    } else if (res?.status === 401) {
      console.log('Remove User from Chat: Unauthorized');
      setErrorAddingUser(true);
    }
  } catch (error) {
    console.error('Remove User from Chat: Unauthorized', error);
    setErrorAddingUser(true);
    throw error;
  }
};

export default RemoveUserFromChat;
