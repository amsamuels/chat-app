import AsyncStorage from '@react-native-async-storage/async-storage';

const AddContact = async (
  id,
  setContactAdded,
  setAddError,
  setForbidden,
  setUnauthorized,
  setCannoAddyourself,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // get token from async storage
    const res = await fetch(`${process.env.API_URL}user/${id}/contact`, {
      // fetch from API
      method: 'POST', // set method to post
      headers: {
        // set headers
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Authorization': token,
      },
    }); // end fetch
    if (res?.status === 200) {
      // if status is 200, then the contact was successfully added
      console.log('Contact: Successfully Added contact'); // log to console
      setContactAdded(true); // set state to true
    } else if (res?.status === 400) {
      // if status is 400, then the contact was not successfully added
      console.log('Add Contact: cannot add yourself'); // log to console
      setCannoAddyourself(true); // set state to true
    } else if (res?.status === 401) {
      // if status is 401, then the contact was not successfully added
      console.log('Add Contact: Unauthorized'); // log to console
      setUnauthorized(true); // set state to true
    } else if (res?.status === 404) {
      // if status is 404, then the contact was not successfully added
      console.log('Add Contact: Not Found'); // log to console
      setForbidden(true); // set state to true
    } else if (res?.status === 500) {
      // if status is 500, then the contact was not successfully added
      console.log('Add Contact: Server Error'); // log to console
      setServerError(true); // set state to true
    }
  } catch (error) {
    // if there is an error, then log to console
    console.error('Failed to create user:', error); // log to console
    setAddError(true); // set state to true
    throw error; // throw error
  }
};

export default AddContact;
