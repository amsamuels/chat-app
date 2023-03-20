import AsyncStorage from '@react-native-async-storage/async-storage';

const SendChatMessage = async (
  data,
  chatId,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${process.env.API_URL}chat/${chatId}/message`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });

    if (res?.status === 200) {
      console.log('Send Chat Message: Successfully sent message');
    } else if (res?.status === 401) {
      console.log('Send Chat Message: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 400) {
      console.log('Send Chat Message: Bad Request');
      setError(true);
    } else if (res?.status === 404) {
      console.log('Send Chat Message: Not Found');
      setNotFound(true);
    } else if (res?.status === 500) {
      console.log('Send Chat Message: Internal Server Error');
      setServerError(true);
    }
  } catch (error) {
    console.error('Add User to Chat: Unauthorized', error);
    setError(true);
    throw error;
  }
};

export default SendChatMessage;
