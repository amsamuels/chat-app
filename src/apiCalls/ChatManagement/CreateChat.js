import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateChat = async (
  data,
  setSuccessful,
  setErrorCreatingChat,
  setUnauthorized,
  setServerError
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${process.env.API_URL}chat`, {
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
      setSuccessful(true);
    } else if (res?.status === 400) {
      console.log('Start Chat: Bad Request');
      setErrorCreatingChat(true);
    } else if (res?.status === 401) {
      console.log('Start Chat: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 500) {
      console.log('Start Chat: Internal Server Error');
      setServerError(true);
    }
  } catch (error) {
    console.error('Start Chat: Unauthorized', error);
    setErrorCreatingChat(true);
    throw error;
  }
};

export default CreateChat;
