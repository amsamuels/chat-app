import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, TextInput } from '../../components';
import { CreateUser, ShowToast, FormSchema } from '../../apiCalls';
import { ROUTES } from '../../constants';

function SignUp(props) {
  const { navigation } = props; // Destructure props
  const { ...methods } = useForm({
    // Use the useForm hook
    resolver: zodResolver(FormSchema), // Use the zod resolver
  });
  const [accountCreated, setAccountCreated] = useState(false); // State to check if account was created
  const [signupError, setSignupError] = useState(false); // State to check if there was an error creating the account
  const [serverError, setServerError] = useState(false); // State to check if there was a server error

  const onSubmit = async (data) => {
    // Function to create a user
    try {
      setAccountCreated(false);
      setSignupError(false);
      setServerError(false);
      await CreateUser(data, setAccountCreated, setSignupError, setServerError); // Call the CreateUser function from apiCalls
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
  useEffect(() => {
    // useEffect hook to check if account was created
    if (accountCreated) {
      // If account was created
      ShowToast('success', 'Account created successfully', 'Login to continue'); // Show a success toast
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (signupError) {
      // If there was an error creating the account
      ShowToast(
        // Show a toast with the error message
        'error',
        'Oops, Error creating account. Try again.',
        'Password requires 1 upper, 1 number, 1 special character'
      );
    }
    if (serverError) {
      // If there was a server error
      // If there was a server error
      ShowToast('error', 'Oops, Server error. Try again.', 'Server error');
    }
  }, [accountCreated, signupError]); // Add the accountCreated and signupError states to the useEffect hook

  return (
    <View className='w-full h-full bg-white pt-10 flex flex-col my-4 items-center'>
      <Text className='text-xl py-6 font-semibold'>Create Your Account</Text>
      <View className='flex flex-col  px-4 mb-4'>
        <FormProvider {...methods}>
          <View className='py-6'>
            <TextInput
              name='first_name'
              label='First Name'
              placeholder='first name'
              keyboardType='default'
            />
            {methods.formState.errors.first_name && (
              <Text className='text-red-700'>
                {methods.formState.errors.first_name.message}
              </Text>
            )}
            <TextInput
              name='last_name'
              label='Last Name'
              placeholder='last name'
              keyboardType='default'
            />
            {methods.formState.errors.last_name && (
              <Text className='text-red-700'>
                {methods.formState.errors.last_name.message}
              </Text>
            )}
            <TextInput
              name='email'
              label='Email'
              placeholder='jon.doe@email.com'
              keyboardType='email-address'
            />
            {methods.formState.errors.email && (
              <Text className='text-red-700'>
                {methods.formState.errors.email.message}
              </Text>
            )}
            <TextInput
              name='password'
              label='Password'
              placeholder='********'
              secureTextEntry
            />
            {methods.formState.errors.password && (
              <Text className='text-red-700'>
                {methods.formState.errors.password.message}
              </Text>
            )}
          </View>
          <View className='flex flex-col space-y-4'>
            <Button onPress={methods.handleSubmit(onSubmit)} text='CREATE' />
            <Button
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              text='LOGIN'
            />
          </View>
        </FormProvider>
      </View>
    </View>
  );
}

export default SignUp;
