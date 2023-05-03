import React from 'react';
import { View, Text } from 'react-native';
import { formatDuration } from '../constants';

const MessageComp = ({ author, message, timestamp }) => {
  return (
    <>
      <View className='border rounded w-64 bg-slate-400 px-2 py-2 mx-2 my-2'>
        <View className='flex flex-row justify-between space-x-4'>
          <Text className=''>{formatDuration(timestamp)}</Text>
          <Text class='px-4 py-2 inline-block text-gray-600'>{message}</Text>
        </View>
      </View>
      <Text className='text-base capitalize font-semibold pt-2 truncate overflow-hidden'>
        {author}
      </Text>
    </>
  );
};

export default MessageComp;
