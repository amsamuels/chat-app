import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UnblockContact = async (
  id,
  setSuccessfullyUnblocked,
  setErrorBlocking,
  setForbidden,
  setUnauthorized,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from AsyncStorage
    const res = await fetch(`${API_URL}user/${id}/block`, {
      // Fetch API
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      // If status is 200, then the contact was successfully unblocked
      console.log('Unblock Contact: Successfully Unblock Contact'); // Log to console
      setSuccessfullyUnblocked(true); // Set state to true
    } else if (res?.status === 400) {
      // If status is 400, then the contact was not successfully unblocked
      console.log('Unblock Contact: Failed to Unblock Contact'); // Log to console
      setErrorBlocking(true); // Set state to true
    } else if (res?.status === 401) {
      // If status is 401, then the user is unauthorized
      console.log('Unblock Contact: Unauthorized'); // Log to console
      setUnauthorized(true); // Set state to true
    } else if (res?.status === 404) {
      // If status is 404, then the contact was not found
      console.log('Unblock Contact: Not Found'); // Log to console
      setForbidden(true); // Set state to true
    } else if (res?.status === 500) {
      // If status is 500, then there is a server error
      console.log('Unblock Contact: Server Error'); // Log to console
      setServerError(true); // Set state to true
    }
  } catch (error) {
    // If there is an error, then log to console and set state to true
    console.error('Failed to Unblock Contact:', error); // Log to console
    setErrorBlocking(true); // Set state to true
    throw error;
  }
};

export default UnblockContact;
