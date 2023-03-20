import * as ImagePicker from 'expo-image-picker';
import ShowToast from './ShowToast';

const pickImage = async () => {
  try {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (
      cameraStatus.status !== 'granted' ||
      mediaLibraryStatus.status !== 'granted'
    ) {
      ShowToast(
        'error',
        'Sorry, we need camera and media library permissions to make this work!'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      return result.assets[0].uri;
    }
    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!cameraResult.canceled) {
      return cameraResult.assets[0].uri;
    }
    return null; // add this line to ensure that the function always returns a value
  } catch (E) {
    console.log(E);
  }
};

export default pickImage;
