import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUserToChat = async (
  chat_id,
  user_id,
  setChatUserAdded,
  setUserInChat,
  setErrorAddingUser
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}/user/${user_id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      console.log('Add User to Chat: Successfully Added User to Chat');
      setChatUserAdded(true);
    } else if (res?.status === 400) {
      console.log('Add User to Chat: User Already in Chat');
      setUserInChat(true);
    } else if (res?.status === 401) {
      console.log('Add User to Chat: Unauthorized');
      setErrorAddingUser(true);
    }
  } catch (error) {
    console.error('Add User to Chat: Unauthorized', error);
    setErrorAddingUser(true);
    throw error;
  }
};

export default AddUserToChat;
