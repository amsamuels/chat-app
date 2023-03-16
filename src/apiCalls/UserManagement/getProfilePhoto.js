import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const getProfilePhoto = async (
  setUnauthorized,
  setForbidden,
  setServerError,
) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
    const res = await fetch(`${API_URL}user/${id}/photo`, {
      method: 'GET',
      headers: {
        'X-Authorization': token,
        accept: 'image/png',
      },
    });
    if (res?.status === 200) {
      // If response is 200
      console.log('get profile photo: Successfully got user photo'); // Log success
      const blob = await res.blob(); // Get blob from response
      const photoUrl = URL.createObjectURL(blob); // Create object url from blob
      return photoUrl; // Return photo url
    } if (res?.status === 401) {
      // If response is 401
      console.log('get profile photo: Unauthorized'); // Log failure
      setUnauthorized(true); // Set error to true
    } else if (res?.status === 404) {
      // If response is 404
      console.log('get profile photo: Not Found'); // Log failure
      setForbidden(true); // Set error to true
    } else if (res?.status === 500) {
      // If response is 500
      console.log('get profile photo: Server error'); // Log failure
      setServerError(true); // Set server error to true
    }
  } catch (error) {
    // Catch any errors
    console.error('Failed to get profile photo:', error); // Log failure
    setServerError(true); // Set server error to true
    throw error;
  }
};

export default getProfilePhoto;
