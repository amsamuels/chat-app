import { API_URL } from '@env';
import StoreData from '../StoreData';

// This function is used to login a user
const LoginUser = async (
  user,
  setLoggedIn,
  setIcorrectLogin,
  setLoginError,
  setServerError,
) => {
  try {
    const res = await fetch(`${API_URL}login`, {
      // Make a request to the login endpoint
      method: 'POST', // Use the POST method
      headers: {
        // Set the headers
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user), // Convert the user object to a json string
    });
    const resJson = await res.json(); // Get the response as json
    if (res?.status === 200) {
      // 200 is the status code for a successful request
      console.log('login: Successfully logged user in'); // Log the success
      StoreData('token', resJson.token.toString()); // Store the token in async storage
      StoreData('id', resJson.id.toString()); // Store the id in async storage
      setLoggedIn(true); // Set the logged in state to true
    } else if (res?.status === 400) {
      // 400 is the status code for a bad request
      console.log('Incorrect login details');
      setIcorrectLogin(true); // Set the incorrect login to true
    } else if (res?.status === 500) {
      // 500 is the status code for a server error
      console.log('There was a problem with our server');
      setServerError(true);
    }
  } catch (error) {
    // If there is an error with the request
    setLoginError(true); // Set the login error to true
    console.error('Failed to login user:', error); // Log the error
    throw error;
  }
};

export default LoginUser;
