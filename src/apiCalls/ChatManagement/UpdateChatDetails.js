import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateChatDetails = async (
  chatId,
  data,
  setSuccessful,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // Get token from local storage
    const res = await fetch(`${process.env.API_URL}chat/${chatId}`, {
      // Send request to API
      method: 'PATCH', // Set method to PUT
      headers: {
        // Set headers
        Accept: 'application/json', // Accept JSON response
        'Content-Type': 'application/json', // Send JSON data
        'X-Authorization': token, // Send token
      },
      body: JSON.stringify(data), // Send data
    });
    if (res?.status === 200) {
      // If request was successful
      setSuccessful(true); // Set state to true
      console.log('Update chat details: Successfully updated chat details'); // Log success
    } else if (res?.status === 401) {
      // If request was unauthorized
      console.log('Failed to update chat details: Unauthorized'); // Log error
      setUnauthorized(true); // Set state to true
    } else if (res?.status === 403) {
      // If request was forbidden
      console.log('Failed to update chat details: Forbidden'); // Log error
      setForbidden(true); // Set state to true
    } else if (res?.status === 404) {
      // If chat was not found
      console.log('Failed to update chat details: Chat not found'); // Log error
      setNotFound(true); // Set state to true
    } else if (res?.status === 500) {
      // If server error
      console.log('Failed to update chat details: Server error'); // Log error
      setServerError(true); // Set state to true
    }
  } catch (error) {
    console.error('Failed to update chat details: Unauthorized', error);
    setError(true);
    throw error;
  }
};
export default UpdateChatDetails;
