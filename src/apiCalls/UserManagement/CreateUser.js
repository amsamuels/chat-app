import { API_URL } from '@env';

const CreateUser = async (user, setAccountCreated, setSignupError) => {
  try {
    const res = await fetch(`${API_URL}user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (res?.status === 200) {
      console.log('createUser: Account successfully created');
      setAccountCreated(true);
    } else if (res?.status === 400) {
      console.log('createUser: Bad request');
      setSignupError(true);
    }
  } catch (error) {
    console.error('Failed to create user:', error);
    setSignupError(true);
    throw error;
  }
};

export default CreateUser;
