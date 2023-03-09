import { View, Text, Subheading, Keyboard } from 'react-native';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, TextInput } from '../../components';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUser, ShowToast, FormSchema } from '../../apiCalls';
import { ROUTES } from '../../constants';

const SignUp = (props) => {
  const { navigation } = props;
  const { ...methods } = useForm({
    resolver: zodResolver(FormSchema),
  });
  const [accountCreated, setAccountCreated] = useState(false);
  const [signupError, setSignupError] = useState(false);

  const onSubmit = async (data) => {
    try {
      Keyboard.dismiss();
      setAccountCreated(false);
      setSignupError(false);
      await CreateUser(data, setAccountCreated, setSignupError);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
  useEffect(() => {
    if (accountCreated) {
      ShowToast('success', 'Account created successfully', 'Login to continue');
      navigation.navigate(ROUTES.LOGIN);
    }

    if (signupError) {
      ShowToast(
        'error',
        'Oops, Error creating account. Try again.',
        'Password requires 1 upper, 1 number, 1 special character'
      );
    }
  }, [accountCreated, signupError]);

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
              <Text className={'text-red-700'}>
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
              <Text className={'text-red-700'}>
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
              <Text className={'text-red-700'}>
                {methods.formState.errors.password.message}
              </Text>
            )}
          </View>
          <Button
            onPress={methods.handleSubmit(onSubmit)}
            text='Create Account'
          />
        </FormProvider>
      </View>
    </View>
  );
};

export default SignUp;
