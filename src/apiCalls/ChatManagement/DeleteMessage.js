import AsyncStorage from '@react-native-async-storage/async-storage';

const DeleteMessage = async (
  chatId,
  messageId,
  setSuccessful,
  setError,
  setUnauthorized,
  setNotFound,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(
      `${process.env.API_URL}chat/${chatId}/message/${messageId}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      },
    );
    if (res?.status === 200) {
      console.log('Delete Message: Successfully Deleted Message');
      setSuccessful(true);
    } else if (res?.status === 401) {
      console.log('Delete Message: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 400) {
      console.log('Delete Message: Bad Request');
      setError(true);
    } else if (res?.status === 404) {
      console.log('Delete Message: Not Found');
      setNotFound(true);
    } else if (res?.status === 500) {
      console.log('Delete Message: Internal Server Error');
      setServerError(true);
    }
  } catch (error) {
    console.error('Delete Message Failed', error);
    setError(true);
    throw error;
  }
};
export default DeleteMessage;
