import React from 'react';
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
  const { navigation } = props;
  const [profile, setProfile] = useState(null);
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [updateError, setUpdateError] = useState(false);
  const { ...methods } = useForm({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = async (data) => {
    try {
      Keyboard.dismiss();
      await UpdateUser(data, setAccountUpdated, setUpdateError);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };
  useEffect(() => {
    async function getUser() {
      const getUser = await GetUser();
      console.log(getUser);
      setProfile(getUser);
    }
    getUser();
    if (accountUpdated) {
      ShowToast('success', 'Account updated successfully');
    }

    if (updateError) {
      ShowToast(
        'error',
        'Oops, Error updating account. Try again.',
        'Password requires 1 upper, 1 number, 1 special character'
      );
    }
  }, [accountUpdated, updateError]);

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
