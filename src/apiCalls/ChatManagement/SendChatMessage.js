import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { data } from 'autoprefixer';

const SendChatMessage = async (
  data,
  chat_id,
  setSuccessfullySentMessage,
  setErrorSendingMesaage
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(`${API_URL}chat/${chat_id}/message`, {
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
      setSuccessfullySentMessage(true);
    } else if (res?.status === 401) {
      console.log('Send Chat Message: Unauthorized');
      setErrorSendingMesaage(true);
    }
  } catch (error) {
    console.error('Add User to Chat: Unauthorized', error);
    setErrorSendingMesaage(true);
    throw error;
  }
};

export default SendChatMessage;
