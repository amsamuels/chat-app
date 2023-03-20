import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchUser = async (searchText, type, setForbidden, setUnauthorized) => {
  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await fetch(
      `${process.env.API_URL}search?q=${searchText}&search_in=${type}&limit=20&offset=0`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Authorization': token,
        },
      },
    );
    const resJson = await res.json();
    if (res?.status === 200) {
      console.log('Successfully searched user');
      return resJson;
    } if (res?.status === 401) {
      console.log('Failed to search user: Unauthorized');
      setUnauthorized(true);
    } else if (res?.status === 403) {
      console.log('Failed to search user: Forbidden');
      setForbidden(true);
    }
    return null; // add this line to ensure that the function always returns a value
  } catch (error) {
    console.error('Failed to search user:', error);
    throw error;
  }
};

export default SearchUser;
