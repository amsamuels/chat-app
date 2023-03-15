import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants';
import { useForm, FormProvider } from 'react-hook-form';
import { TextInput } from '../../components';
import { CreateChat, ShowToast } from '../../apiCalls';
import * as z from 'zod';

const NewChat = (props) => {
  const { navigation } = props;
  const [errorCreatingChat, setErrorCreatingChat] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [serverError, setServerError] = useState(false);
  const { ...methods } = useForm();
  const Schema = z.string().min(1).max(1000); // Schema to validate the search query
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message

  const onSubmit = async (data) => {
    try {
      setErrorCreatingChat(false);
      setSuccessful(false);
      setUnauthorized(false);
      setServerError(false);
      await CreateChat(
        Schema.parse(data),
        data,
        setSuccessful,
        setErrorCreatingChat,
        setUnauthorized,
        setServerError
      );
      navigation.navigate(ROUTES.MAIN);
    } catch (error) {
      setErrorMessage(error.message); // Set the error message
    }
  };
  useEffect(() => {
    if (successful) {
      ShowToast('success', 'Request successful');
    }
    if (errorCreatingChat) {
      // Handle the error
      ShowToast('error', 'Error Something went wrong');
    }
    if (unauthorized) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (serverError) {
      // Handle the server error
      ShowToast('error', 'Server error');
    }
  }, [successful, unauthorized, errorCreatingChat, serverError]);

  return (
    <View className={'w-full h-full bg-white flex flex-col p-4'}>
      <View className={'flex flex-row items-center justify-between '}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.MAIN)}
          className={' p-2 w-fit flex flex-row items-center'}
        >
          <Text className={'px-2 py-2 font-semibold  text-lg'}>Back</Text>
        </TouchableOpacity>
      </View>
      <View className={'flex flex-col items-center justify-center'}>
        <Text className={'text-2xl font-semibold'}>New Chat</Text>
        <FormProvider {...methods}>
          <View className={'py-6 space-y-4'}>
            <TextInput
              name='name'
              label='Chat Name'
              placeholder='Enter Chat Name'
              keyboardType='default'
            />
            {errorMessage ? (
              <Text className='text-red-500 p-1 text-center'>
                Cannot be empty
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={methods.handleSubmit(onSubmit)}
              className={
                ' p-2 bg-blue-700 rounded border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
              }
            >
              <Text className='text-xl text-center truncate font-semibold'>
                Create Chat
              </Text>
            </TouchableOpacity>
          </View>
        </FormProvider>
      </View>
    </View>
  );
};

export default NewChat;
