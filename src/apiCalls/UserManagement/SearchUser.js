import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const SearchUser = async (searchText, type) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(
      `${API_URL}search?q=${searchText}&search_in=${type}&limit=20&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Authorization': token,
        },
      }
    );
    const resJson = await res.json();
    if (res?.status === 200) {
      console.log('Successfully searched user');
      return resJson;
    }
  } catch (error) {
    console.error('Failed to search user:', error);
    throw error;
  }
};

export default SearchUser;
