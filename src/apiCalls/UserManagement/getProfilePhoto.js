import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const getProfilePhoto = async () => {
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
    console.log('get profile photo: Successfully got user photo');
    const blob = await res.blob();
    const photoUrl = URL.createObjectURL(blob);
    return photoUrl;
  } else {
    console.log('get profile photo: Failed to get user photo');
  }
};

export default getProfilePhoto;
