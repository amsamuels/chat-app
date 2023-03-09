import { API_URL } from '@env';

const CreateUser = async (
  user,
  setAccountCreated,
  setSignupError,
  setServerError
) => {
  try {
    const res = await fetch(`${API_URL}user`, {
      // Call the API_URL from .env
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (res?.status === 200) {
      // If the status is 200
      console.log('createUser: Account successfully created'); // Log a message
      setAccountCreated(true); // Set the accountCreated state to true
    } else if (res?.status === 400) {
      // If the status is 400
      console.log('createUser: Bad request'); // Log a message
      setSignupError(true); // Set the signupError state to true
    } else if (res?.status === 500) {
      // If the status is 500
      console.log('createUser: Server error'); // Log a message
      setServerError(true); // Set the serverError state to true
    }
  } catch (error) {
    console.error('Failed to create user:', error); // Log the error
    setSignupError(true); // Set the signupError state to true
    throw error;
  }
};

export default CreateUser;
