import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UpdateUser = async (
  data,
  setAccountUpdated,
  setUnauthorized,
  setForbidden,
  setBadRequest,
  setServerError,
  setNotFound,
  setUpdateError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from async storage
    const id = await AsyncStorage.getItem('@id'); // Get user id from async storage
    const res = await fetch(`${API_URL}user/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(data),
    });
    if (res?.status === 200) {
      // If response is 200
      setAccountUpdated(true); // Set account updated to true
      console.log('update user: Successfully updated user'); // Log success
    } else if (res?.status === 400) {
      // If response is 400
      setBadRequest(true); // Set error to true
      console.log('update user: Bad request'); // Log failure
    } else if (res?.status === 401) {
      // If response is 401
      setUnauthorized(true); // Set error to true
      console.log('update user: Unauthorized'); // Log failure
    } else if (res?.status === 403) {
      // If response is 403
      console.log('Update Forbidden'); // Log failure
      setForbidden(true); // Set error to true
    } else if (res?.status === 404) {
      // If response is 404
      console.log('Not Found'); // Log failure
      setNotFound(true); // Set error to true
    } else if (res?.status === 500) {
      // If response is 500
      console.log('Server error'); // Log failure
      setServerError(true); // Set server error to true
    }
  } catch (error) {
    // Catch any errors
    console.error('Failed to update user: Unauthorized', error); // Log failure
    setUpdateError(true); // Set error to true
    throw error;
  }
};
export default UpdateUser;
