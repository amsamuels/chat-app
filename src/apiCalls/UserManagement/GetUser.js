import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GetUser = async (
  setGetUserSuccess,
  setUnauthorized,
  setErrorGettingUser,
  setServerError
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from storage
    const id = await AsyncStorage.getItem('@id'); // Get id from storage
    const res = await fetch(`${API_URL}user/${id}`, {
      // Get user from API
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    const data = await res.json(); // Get data from response
    if (res?.status === 200) {
      // If response is 200
      console.log('get user: Successfully got user'); // Log success
      setGetUserSuccess(true); // Set success to true
      return data; // Return data
    } else if (res?.status === 401) {
      // If response is 401
      console.log('get user: Failed to get user'); // Log failure
      setUnauthorized(true); // Set unauthorized to true
    } else if (res?.status === 404) {
      // If response is 404
      console.log('get user: User not found'); // Log failure
      setErrorGettingUser(true); // Set error to true
    } else if (res?.status === 500) {
      // If response is 500
      console.log('get user: Server error'); // Log failure
      setServerError(true); // Set server error to true
    }
  } catch (error) {
    // If there is an error
    console.error('Failed to get user:', error); // Log error
    setErrorGettingUser(true); // Set error to true
    throw error;
  }
};

export default GetUser;
