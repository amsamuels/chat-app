import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ROUTES } from '../../constants';
import { useForm, FormProvider } from 'react-hook-form';
import { TextInput } from '../../components';
import { CreateChat } from '../../apiCalls';

const NewChat = (props) => {
  const { navigation } = props;
  const [chatCreated, setChatCreated] = useState(false);
  const [errorCreatingChat, setErrorCreatingChat] = useState(false);
  const { ...methods } = useForm();
  const onSubmit = async (data) => {
    try {
      setChatCreated(false);
      setErrorCreatingChat(false);
      const createChat = await CreateChat(
        data,
        setChatCreated,
        setErrorCreatingChat
      );
      navigation.navigate(ROUTES.MAIN);
    } catch (error) {}
  };

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
