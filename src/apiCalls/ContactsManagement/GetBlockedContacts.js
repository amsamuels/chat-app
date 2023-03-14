import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const GetBlockedContacts = async (setServerError, setUnauthorized) => {
  // pass in the setServerError and setUnauthorized functions as parameters
  try {
    const token = await AsyncStorage.getItem('@token'); // get the token from async storage
    const res = await fetch(`${API_URL}blocked`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    const data = await res.json();
    if (res?.status === 200) {
      // 200 is the status code for a successful request
      console.log(
        'Get Blocked Contacts : Successfully got blocked contacts list'
      );
      return data; // return the data
    } else if (res?.status === 401) {
      // 401 is the status code for an unauthorized request
      console.log('Get Blocked Contacts: Unauthorized'); // log the error
      setUnauthorized(true); // set the unauthorized state to true
    } else if (res?.status === 500) {
      // 500 is the status code for a server error
      console.log('Get Blocked Contacts: Server Error'); // log the error
      setServerError(true); // set the server error state to true
    }
  } catch (error) {
    // catch any errors
    console.error('Failed to get blocked contacts list:', error); // log the error
    throw error; // throw the error
  }
};

export default GetBlockedContacts;
