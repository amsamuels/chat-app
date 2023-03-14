import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GetContact = async (unauthorized, setServerError) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // get the token from async storage
    const res = await fetch(`${API_URL}contacts`, {
      // fetch from API
      method: 'GET', // set method to get
      headers: {
        // set headers
        Accept: 'application/json', // set accept to application/json
        'X-Authorization': token, // set X-Authorization to token
      },
    });
    const data = await res.json(); // get the data from the response
    if (res?.status === 200) {
      // if status is 200, then the contact was successfully deleted
      console.log('Get Contacts: Successfully got contacts list'); // log to console
      return data; // return the data
    } else if (res?.status === 401) {
      // if status is 401, then the contact was not successfully deleted
      console.log('Get Contacts: Unauthorized'); // log to console
      unauthorized(true); // set state to true
    } else if (res?.status === 500) {
      // if status is 500, then the contact was not successfully deleted
      console.log('Get Contacts: Server Error'); // log to console
      setServerError(true); // set state to true
    }
  } catch (error) {
    // if there is an error, then log to console
    console.error('Failed to get contact:', error); // log to console
    setServerError(true); // set state to true
    throw error; // throw error
  }
};

export default GetContact;
