import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { EditMessage } from '../apiCalls';
import * as z from 'zod';

const EditModal = ({
  chat_id,
  editedMessage,
  setEditedMessage,
  selectedMessageId,
  setSelectedMessageId,
  errorMessage2,
  setErrorMessage2,
  setSuccessful,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
}) => {
  const messageSchema = z.string().min(1).max(1000);
  const handleUpdate = async (message_id) => {
    try {
      const messageData = { message: messageSchema.parse(editedMessage) };
      await EditMessage(
        chat_id,
        message_id,
        messageData,
        setSuccessful,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      setErrorMessage2('');
      setSelectedMessageId(null);
      getChatMessages();
    } catch (error) {
      // Handle the error
      setErrorMessage2(error.message);
    }
  };

  return (
    <View className=' inset-0  bg-opacity-50'>
      <View className='relative bg-white mx-auto w-80 my-10 p-4 rounded-lg'>
        <TextInput
          value={editedMessage}
          onChangeText={setEditedMessage}
          className='border-b pb-1 mb-4 w-full'
        />
        {errorMessage2 ? (
          <Text className='text-red-500 p-1 text-center'>Cannot be empty</Text>
        ) : null}
        <View className='flex flex-row space-x-3 justify-end'>
          <TouchableOpacity
            onPress={() => {
              // call function to update message in data source
              handleUpdate(selectedMessageId);
            }}
            className='bg-blue-500 px-4 py-2 rounded-md text-white'
          >
            <Text>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // call function to update message in data source
              setSelectedMessageId(null);
            }}
            className='bg-blue-500 px-4 py-2 rounded-md text-white'
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditModal;
