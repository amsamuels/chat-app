import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { formatDuration } from '../constants';
import { DeleteMessage } from '../apiCalls';

const EditDeleteModal = ({
  author,
  message,
  timestamp,
  chat_id,
  message_id,
  getChatMessages,
  setSuccessful,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
  handleEdit,
}) => {
  const handleDelete = async (message_id) => {
    try {
      const response = await DeleteMessage(
        chat_id,
        message_id,
        setSuccessful,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      getChatMessages();
    } catch (error) {
      // Handle the error
    }
  };
  return (
    <View className='flex items-end'>
      <Text className='text-base capitalize font-semibold pr-4'>{author}</Text>
      <View className='border rounded w-64 bg-sky-400 px-2 py-2 mx-2 my-2'>
        <View className='flex flex-row justify-between'>
          <Text class='px-4 py-2 inline-block text-gray-600'>{message}</Text>
          <Text className='truncate'>{formatDuration(timestamp)}</Text>
        </View>
        <View className='relative inline-block text-left'>
          <View className='flex flex-row space-x-3'>
            <TouchableOpacity
              className='border rounded bg-sky-400 px-2 py-2 mx-2 my-2'
              onPress={() => {
                handleDelete(message_id);
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='border rounded bg-sky-400 px-2 py-2 mx-2 my-2'
              onPress={() => {
                handleEdit(message_id);
              }}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EditDeleteModal;
