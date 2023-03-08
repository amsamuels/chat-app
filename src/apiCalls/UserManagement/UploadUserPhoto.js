import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const UploadUserPhoto = async (data) => {
  console.log(data);
  const base64String = data.img.split(',')[1]; // remove the data:image/png;base64, part from the string
  const mimeType = data.img.split(',')[0].split(':')[1].split(';')[0]; // get the MIME type of the image
  const blob = await fetch(`data:image/jpeg;base64,${base64String}`).then((r) =>
    r.blob()
  );
  try {
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
      console.log('upload user photo: Successfully uploaded user photo');
    } else {
      console.log('upload user photo: Failed to upload user photo');
    }
  } catch (error) {
    console.log(error);
  }
};
export default UploadUserPhoto;
