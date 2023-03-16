import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ContactComp({ contact, chatId, onAddChatUser }) {
  const handleAddChatUser = () => {
    onAddChatUser(chatId, contact.user_id);
  };

  return (
    <View
      key={contact.user_id}
      className="flex flex-row justify-between pb-2 pt-2"
    >
      <View className="flex items-center p-2 space-x-4">
        <View className="flex-1 min-w-0">
          <Text className="text-sm font-medium text-gray-900 truncate">
            {contact.given_name}
            {' '}
            {contact.family_name}
          </Text>
          <Text className="text-sm font-medium text-gray-900 truncate">
            {contact.email}
          </Text>
        </View>
      </View>
      <View className="flex flex-row space-x-3 items-center">
        <TouchableOpacity onPress={handleAddChatUser} className="mt-2 flex">
          <Ionicons name="ios-add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ContactComp;
