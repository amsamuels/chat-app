import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, TextInput } from '../../components';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { LoginUser } from '../../apiCalls';
import { ShowToast } from '../../apiCalls';
import { ROUTES } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password needs to be 8 characters' }),
});

const Login = (props) => {
  const { navigation } = props;
  const { ...methods } = useForm({
    resolver: zodResolver(FormSchema),
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [icorrectLogin, setIcorrectLogin] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
      navigation.navigate(ROUTES.HOME);
    } else {
      console.log('No token found');
      navigation.navigate(ROUTES.LOGIN);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIcorrectLogin(false);
      setLoginError(false);
      await LoginUser(data, setLoggedIn, setIcorrectLogin, setLoginError);
    } catch (error) {
      console.error('Failed to Login user:', error);
    }
  };
  useEffect(() => {
    checkToken();
    if (loggedIn) {
      ShowToast('success', 'Login successful', 'Welcome back');
      navigation.navigate(ROUTES.HOME);
    }
    if (icorrectLogin) {
      ShowToast('error', 'Oops, Incorrect login details. Try again.');
    }
    if (loginError) {
      ShowToast('error', 'Oops, Error logging in. Try again.');
    }
  }, [loggedIn, icorrectLogin, loginError]);

  return (
    <View className='w-full h-full bg-white pt-10 flex flex-col my-4 items-center'>
      <Text className='text-xl py-6 font-semibold'>Login To Your Account</Text>
      <View className='flex flex-col  px-4 mb-4'>
        <FormProvider {...methods}>
          <View className={'py-6'}>
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
          <Button onPress={methods.handleSubmit(onSubmit)} text='Login' />
        </FormProvider>
      </View>
    </View>
  );
};

export default Login;
