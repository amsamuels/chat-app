import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

function Button({ text, icon, onPress, ...rest }) {
  return (
    <TouchableOpacity
      {...rest}
      icon={icon}
      mode='contained'
      onPress={onPress}
      className='text-white py-3 px-6 text-lg rounded-md bg-sky-500 hover:bg-teal-700 border-gray-200 '
    >
      <Text className='text-xl text-center truncate font-semibold'>{text}</Text>
    </TouchableOpacity>
  );
}

export default Button;
