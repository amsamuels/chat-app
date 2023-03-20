import AsyncStorage from '@react-native-async-storage/async-storage';

const LogOut = async () => {
  const token = await AsyncStorage.getItem('@token');
  const res = await fetch(`${process.env.API_URL}logout`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-Authorization': token,
    },
  });
  if (res?.status === 200) {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@id');
    console.log('Logout: Successfully logged out');
  } else if (res?.status === 401) {
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@id');
    console.log('Logout: Unauthorized');
  }
};

export default LogOut;
