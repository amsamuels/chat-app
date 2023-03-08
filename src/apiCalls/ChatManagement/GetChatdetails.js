import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GetChatDetails = async (
  id,
  setSuccessfullyGotMessages,
  setErrorGettingMessages
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${id}?limit=20&offset=0`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    });
    const data = await res.json();
    if (res?.status === 200) {
      console.log('Get Chat Details: Successfully got Chat Details');
      setSuccessfullyGotMessages(true);
      return data;
    } else if (res?.status === 401) {
      console.log('Get Chat Details: Unauthorized');
      setErrorGettingMessages(true);
    }
  } catch (error) {
    console.error('Get Chat Details: Unauthorized', error);
    setErrorGettingMessages(true);
    throw error;
  }
};

export default GetChatDetails;
