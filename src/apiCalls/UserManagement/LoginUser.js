import StoreData from '../StoreData';
import { API_URL } from '@env';

const LoginUser = async (
  user,
  setLoggedIn,
  setIcorrectLogin,
  setLoginError
) => {
  try {
    const res = await fetch(`${API_URL}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user),
    });
    const resJson = await res.json();
    if (res?.status === 200) {
      console.log('login: Successfully logged user in');
      StoreData('token', resJson.token.toString());
      StoreData('id', resJson.id.toString());
      setLoggedIn(true);
    } else if (res?.status === 400) {
      setIcorrectLogin(true);
    }
  } catch (error) {
    setLoginError(true);
    console.error('Failed to login user:', error);
    throw error;
  }
};

export default LoginUser;
