import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UploadUserPhoto = async (
  data,
  setUnauthorized,
  setForbidden,
  setServerError,
  setNotFound,
) => {
  try {
    const base64String = data.img.split(',')[1]; // remove the data:image/png;base64, part from the string
    const mimeType = data.img.split(',')[0].split(':')[1].split(';')[0]; // get the MIME type of the image
    const blob = await fetch(`data:image/jpeg;base64,${base64String}`).then(
      (
        r, // Convert the base64 string to a blob
      ) => r.blob(), // Convert the base64 string to a blob
    );
    const token = await AsyncStorage.getItem('@token');
    const id = await AsyncStorage.getItem('@id');
    const res = await fetch(`${API_URL}user/${id}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'X-Authorization': token,
      },
      body: blob,
    });
    if (res?.status === 200) {
      // If response is 200
      console.log('upload user photo: Successfully uploaded user photo'); // Log success
    } else if (res?.status === 401) {
      // If response is 401
      console.log('upload user photo: Failed to upload user photo'); // Log failure
      setUnauthorized(true); // Set error to true
    } else if (res?.status === 403) {
      // If response is 403
      console.log('upload user photo: Failed to upload user photo'); // Log failure
      setForbidden(true); // Set error to true
    } else if (res?.status === 404) {
      // If response is 404
      console.log('upload user photo: Failed to upload user photo'); // Log failure
      setNotFound(true); // Set error to true
    } else if (res?.status === 500) {
      // If response is 500
      console.log('upload user photo: Failed to upload user photo'); // Log failure
      setServerError(true); // Set server error to true
    }
  } catch (error) {
    // Catch any errors
    console.log(error); // Log failure
  }
};
export default UploadUserPhoto;
