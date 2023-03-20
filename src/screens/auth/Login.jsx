import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput } from '../../components';
import { LoginUser, ShowToast } from '../../apiCalls';

import { ROUTES } from '../../constants';

// This is the schema for the form
const FormSchema = z.object({
  email: z.string().email(), // The email field needs to be a string and a valid email
  password: z.string().min(8, { message: 'Password needs to be 8 characters' }), // The password field needs to be a string and at least 8 characters long
});

function Login(props) {
  // Destructure the navigation prop
  const { navigation } = props;
  const { ...methods } = useForm({
    // Use the useForm hook
    resolver: zodResolver(FormSchema), // Use the zod resolver
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [icorrectLogin, setIcorrectLogin] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [serverError, setServerError] = useState(false);

  // This function is used to check if a user is logged in
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      // If there is a token in async storage
      navigation.navigate(ROUTES.HOME); // Navigate to the home screen
      ShowToast('success', 'Welcome back'); // Show a welcome back toast
    } else {
      // If there is no token in async storage
      console.log('No token found');
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
  };

  // This function is used to login a user
  const onSubmit = async (data) => {
    try {
      setIcorrectLogin(false);
      setLoginError(false);
      setServerError(false);
      await LoginUser(
        data,
        setLoggedIn,
        setIcorrectLogin,
        setLoginError,
        setServerError,
      );
    } catch (error) {
      console.error('Failed to Login user:', error);
    }
  };
  // This useEffect is used to check if a user is logged in
  useEffect(() => {
    checkToken(); // Check if a user is logged in
    if (loggedIn) {
      // If the user is logged in
      ShowToast('success', 'Login successful', 'Welcome back');
      navigation.navigate(ROUTES.HOME); // Navigate to the home screen
    }
    if (icorrectLogin) {
      // If the user is not logged in
      ShowToast('error', 'Oops, Incorrect login details. Try again.'); // Show a toast
    }
    if (loginError) {
      // If there is an error logging in
      ShowToast('error', 'Oops, Error logging in. Try again.'); // Show a toast
    }
    if (serverError) {
      // If there is a server error
      ShowToast('error', 'Sorry Server Error logging in. Try again.'); // Show a toast
    }
  }, [loggedIn, icorrectLogin, loginError]);

  return (
    <View className="w-full h-full bg-white pt-10 flex flex-col my-4 items-center">
      <Text className="text-xl py-6 font-semibold">Login To Your Account</Text>
      <View className="flex flex-col  px-4 mb-4">
        <FormProvider {...methods}>
          <View className="py-6">
            <TextInput
              name="email"
              label="Email"
              placeholder="jon.doe@email.com"
              keyboardType="email-address"
            />
            {methods.formState.errors.email && (
              <Text className="text-red-700">
                {methods.formState.errors.email.message}
              </Text>
            )}

            <TextInput
              name="password"
              label="Password"
              placeholder="********"
              secureTextEntry
            />
            {methods.formState.errors.password && (
              <Text className="text-red-700">
                {methods.formState.errors.password.message}
              </Text>
            )}
          </View>
          <Button onPress={methods.handleSubmit(onSubmit)} text="Login" />
        </FormProvider>
      </View>
    </View>
  );
}

export default Login;
