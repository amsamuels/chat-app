import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const deleteContact = async (
  id,
  setForbidden,
  setUnauthorized,
  setServerError,
  setYourself,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // get token from async storage
    const res = await fetch(`${API_URL}user/${id}/contact`, {
      // fetch from API
      method: 'DELETE', // set method to delete
      headers: {
        // set headers
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      // if status is 200, then the contact was successfully deleted
      console.log('Contact: Successfully Deleted Contact'); // log to console
      setContactAdded(true); // set state to true
    } else if (res?.status === 400) {
      // if status is 400, then the contact was not successfully deleted
      console.log('Contact: You cannot delete yourself'); // log to console
      setYourself(true); // set state to true
    } else if (res?.status === 401) {
      // if status is 401, then the contact was not successfully deleted
      console.log('Contact: Unauthorized'); // log to console
      setUnauthorized(true); // set state to true
    } else if (res?.status === 404) {
      // if status is 404, then the contact was not successfully deleted
      console.log('Contact: Not Found'); // log to console
      setForbidden(true); // set state to true
    } else if (res?.status === 500) {
      // if status is 500, then the contact was not successfully deleted
      console.log('Contact: Server Error'); // log to console
      setServerError(true); // set state to true
    }
  } catch (error) {
    // if there is an error, then log to console
    console.error('Failed to Deleted Contact:', error); // log to console
    setServerError(true); // set state to true
    throw error; // throw error
  }
};
export default deleteContact;
