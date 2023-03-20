import AsyncStorage from '@react-native-async-storage/async-storage';

const BlockContact = async (
  id,
  setContactBlocked,
  setErrorBlocking,
  setForbidden,
  setUnauthorized,
  setServerError,
  setYourself,
) => {
  try {
    const token = await AsyncStorage.getItem('@token'); // get token from async storage
    const res = await fetch(`${process.env.API_URL}user/${id}/block`, {
      // fetch from API
      method: 'POST', // set method to post
      headers: {
        // set headers
        Accept: 'application/json',
        'X-Authorization': token,
      },
    });
    if (res?.status === 200) {
      // if status is 200, then the contact was successfully blocked
      console.log('Block Contact: Successfully Blocked Contact'); // log to console
      setContactBlocked(true); // set state to true
    } else if (res?.status === 400) {
      // if status is 400, then the contact was not successfully blocked
      console.log('Block Contact: You cannot block yourself'); // log to console
      setYourself(true); // set state to true
    } else if (res?.status === 401) {
      // if status is 401, then the contact was not successfully blocked
      console.log('Block Contact: Unauthorized'); // log to console
      setUnauthorized(true); // set state to true
    } else if (res?.status === 404) {
      // if status is 404, then the contact was not successfully blocked
      console.log('Block Contact: Not Found'); // log to console
      setForbidden(true); // set state to true
    } else if (res?.status === 500) {
      // if status is 500, then the contact was not successfully blocked
      console.log('Block Contact: Server Error'); // log to console
      setServerError(true); // set state to true
    }
  } catch (error) {
    // if there is an error, then log to console
    console.error('Failed to Block Contact:', error); // log to console
    setErrorBlocking(true); // set state to true
    throw error; // throw error
  }
};

export default BlockContact;
