import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, TextInput } from '../../components';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShowToast, FormSchema, GetUser, UpdateUser } from '../../apiCalls';
import { ROUTES } from '../../constants';

const EditProfile = (props) => {
  const { navigation } = props; // Destructure the navigation prop
  const [profile, setProfile] = useState(null); // Set the profile state
  const [accountUpdated, setAccountUpdated] = useState(false); // Set the account updated state
  const [updateError, setUpdateError] = useState(false); // Set the update error state
  const [forbidden, setForbidden] = useState(false); // Set the forbidden state
  const [notFound, setNotFound] = useState(false); // Set the not found state
  const [errorGettingUser, setErrorGettingUser] = useState(false); // Set the error getting user state
  const [getUserSuccess, setGetUserSuccess] = useState(false); // Set the get user success state
  const [Unauthorized, setUnauthorized] = useState(false); // Set the unauthorized state
  const [badRequest, setBadRequest] = useState(false); // Set the bad request state
  const [ServerError, setServerError] = useState(false); // Set the server error state
  const { ...methods } = useForm({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data) => {
    try {
      setAccountUpdated(false);
      setBadRequest(false);
      setForbidden(false);
      setNotFound(false);
      setServerError(false);
      setUnauthorized(false);
      setUpdateError(false);
      Keyboard.dismiss();
      await UpdateUser(
        data,
        setAccountUpdated,
        setUnauthorized,
        setForbidden,
        setBadRequest,
        setServerError,
        setNotFound,
        setUpdateError
      );
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
  async function getUser() {
    setErrorGettingUser(false);
    setGetUserSuccess(true);
    setServerError(false);
    setUnauthorized(false);
    const getUser = await GetUser(
      setGetUserSuccess,
      setUnauthorized,
      setErrorGettingUser,
      setServerError
    );
    setProfile(getUser);
  }

  useEffect(() => {
    getUser();
    if (accountUpdated) {
      ShowToast('success', 'Account updated successfully');
    }
    if (badRequest) {
      ShowToast('error', 'Wrong Password');
    }
    if (Unauthorized) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (forbidden) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (notFound) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (ServerError) {
      ShowToast('error', 'Server error');
    }
    if (errorGettingUser) {
      ShowToast('error', 'Error getting user');
    }
  }, [
    accountUpdated,
    updateError,
    badRequest,
    forbidden,
    notFound,
    errorGettingUser,
  ]);

  return (
    <View className={'w-full h-full bg-white flex flex-col'}>
      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.SETTING)}
        className={'px-2 text-left'}
      >
        <Text className={'p-4 text-lg'}>Cancel</Text>
      </TouchableOpacity>
      <Text className={'text-xl py-4 text-center font-semibold'}>
        Update Your Profile
      </Text>
      <ScrollView>
        <View className={'flex flex-col items-center px-4 mb-4'}>
          {profile && (
            <FormProvider {...methods}>
              <View className={'py-6'}>
                <TextInput
                  name='first_name'
                  label='First Name'
                  placeholder='First Name'
                  keyboardType='default'
                  defaultValue={profile?.first_name}
                />
                {methods.formState.errors.first_name && (
                  <Text className={'text-red-700'}>
                    {methods.formState.errors.first_name.message}
                  </Text>
                )}
                <TextInput
                  name='last_name'
                  label='Last Name'
                  placeholder='last name'
                  keyboardType='default'
                  defaultValue={profile?.last_name}
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
                  defaultValue={profile?.email}
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
              <Button onPress={methods.handleSubmit(onSubmit)} text='Update' />
            </FormProvider>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
