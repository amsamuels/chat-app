import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMessage = async (
  chatId,
  messageId,
  data,
  setSuccessful,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(
      `${process.env.API_URL}chat/${chatId}/message/${messageId}`,
      {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
        body: JSON.stringify(data),
      },
    );
    if (res?.status === 200) {
      setSuccessful(true);
      console.log('Edit Message: Successfully Edited Message');
    } else if (res?.status === 401) {
      console.log('Failed to Edit Message: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 400) {
      console.log('Failed to Edit Message: Bad Request');
      setError(true);
    } else if (res?.status === 404) {
      console.log('Failed to Edit Message: Not Found');
      setNotFound(true);
    } else if (res?.status === 500) {
      console.log('Failed to Edit Message: Internal Server Error');
      setServerError(true);
    }
  } catch (error) {
    console.error('Failed to Edit Message: Unauthorized', error);
    setError(true);
    throw error;
  }
};
export default EditMessage;
