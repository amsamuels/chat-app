import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GetChats = async (setGetChatsSuccess, setGetChatsError) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    const data = await res.json();
    if (res?.status === 200) {
      console.log('Get Chat List: Successfully got Chat List');
      setGetChatsSuccess(true);
      return data;
    } else if (res?.status === 401) {
      console.log('Get Chat List: Unauthorized');
      setGetChatsError(true);
    } else if (res?.status === 500) {
      console.log('Get Chat List: Internal Server Error');
      setGetChatsError(true);
    }
  } catch (error) {
    console.error('Get Chat List: Unauthorized', error);
    setGetChatsError(true);
    throw error;
  }
};
export default GetChats;
