import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddUserToChat = async (
  chat_id,
  user_id,
  setSuccessful,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from local storage
    const res = await fetch(`${API_URL}chat/${chat_id}/user/${user_id}`, {
      // Send request to API
      method: 'POST', // Set method to POST
      headers: {
        // Set headers
        Accept: 'application/json', // Accept JSON response
        'Content-Type': 'application/json', // Send JSON data
        'X-Authorization': token, // Send token
      },
    });
    if (res?.status === 200) {
      // If request was successful
      console.log('Add User to Chat: Successfully Added User to Chat'); // Log success
      setSuccessful(true); // Set state to true
    } else if (res?.status === 400) {
      // If request was bad
      console.log('Add User to Chat: User Already in Chat'); // Log error
      setError(true); // Set state to true
    } else if (res?.status === 401) {
      // If request was unauthorized
      console.log('Add User to Chat: Unauthorized'); // Log error
      setUnauthorized(true); // Set state to true
    } else if (res?.status === 403) {
      // If request was forbidden
      console.log('Add User to Chat: Forbidden'); // Log error
      setForbidden(true); // Set state to true
    } else if (res?.status === 404) {
      // If chat was not found
      console.log('Add User to Chat: Chat Not Found'); // Log error
      setNotFound(true); // Set state to true
    } else if (res?.status === 500) {
      // If server error
      console.log('Add User to Chat: Server Error'); // Log error
      setServerError(true); // Set state to true
    }
  } catch (error) {
    // Catch error
    console.error('Add User to Chat: Error', error); // Log error
    setError(true); // Set state to true
    throw error; // Throw error
  }
};

export default AddUserToChat;
