import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryStatus =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (
    cameraStatus.status !== 'granted' ||
    mediaLibraryStatus.status !== 'granted'
  ) {
    alert(
      'Sorry, we need camera and media library permissions to make this work!'
    );
    return;
  }
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      return result.assets[0].uri;
    } else {
      let cameraResult;
      cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!cameraResult.canceled) {
        return cameraResult.assets[0].uri;
      }
    }
  } catch (E) {
    console.log(E);
  }
};

export default pickImage;
