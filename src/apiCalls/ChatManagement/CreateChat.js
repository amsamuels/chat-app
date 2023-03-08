import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const CreateChat = async (data, setChatCreated, setErrorCreatingChat) => {
  try {
    console.log(JSON.stringify(data));
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });
    if (res?.status === 201) {
      console.log('Start Chat: Successfully started chat');
      setChatCreated(true);
    } else if (res?.status === 401) {
      console.log('Start Chat: Unauthorized');
      setErrorCreatingChat(true);
    }
  } catch (error) {
    console.error('Start Chat: Unauthorized', error);
    setErrorCreatingChat(true);
    throw error;
  }
};

export default CreateChat;
