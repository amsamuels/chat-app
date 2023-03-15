import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GetChatDetails = async (
  id,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from local storage
    const res = await fetch(`${API_URL}chat/${id}?limit=20&offset=0`, {
      // Send request to API
      method: 'GET', // Set method to GET
      headers: {
        // Set headers
        Accept: 'application/json', // Accept JSON response
        'Content-Type': 'application/json', // Send JSON data
        'X-Authorization': token, // Send token
      },
    });
    const data = await res.json(); // Get response data
    if (res?.status === 200) {
      // If request was successful
      console.log('Get Chat Details: Successfully got Chat Details'); // Log success
      return data; // Return data
    } else if (res?.status === 401) {
      // If request was unauthorized
      console.log('Get Chat Details: Unauthorized'); // Log error
      setUnauthorized(true); // Set state to true
    } else if (res?.status === 403) {
      // If request was forbidden
      console.log('Get Chat Details: Forbidden'); // Log error
      setForbidden(true); // Set state to true
    } else if (res?.status === 404) {
      // If chat was not found
      console.log('Get Chat Details: Chat not found'); // Log error
      setNotFound(true); // Set state to true
    } else if (res?.status === 500) {
      // If server error
      console.log('Get Chat Details: Server error'); // Log error
      setServerError(true); // Set state to true
    }
  } catch (error) {
    // If request failed
    console.error('Get Chat Details: Unauthorized', error); // Log error
    setError(true); // Set state to true
    throw error; // Throw error
  }
};

export default GetChatDetails;
