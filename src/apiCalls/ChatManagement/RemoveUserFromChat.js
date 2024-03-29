import AsyncStorage from '@react-native-async-storage/async-storage';

const RemoveUserFromChat = async (
  chatID,
  userId,
  setSuccessful,
  setErrorAddingUser,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(
      `${process.env.API_URL}chat/${chatID}/user/${userId}`,
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
      console.log('Remove User from Chat: Successfully removed user');
      setSuccessful(true);
    } else if (res?.status === 401) {
      console.log('Remove User from Chat: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 403) {
      console.log('Remove User from Chat: Forbidden');
      setForbidden(true);
    } else if (res?.status === 404) {
      console.log('Remove User from Chat: User not in chat');
      setNotFound(true);
    } else if (res?.status === 500) {
      console.log('Remove User from Chat: Server Error');
      setServerError(true);
    }
  } catch (error) {
    console.error('Remove User from Chat: Unauthorized', error);
    setErrorAddingUser(true);
    throw error;
  }
};

export default RemoveUserFromChat;
