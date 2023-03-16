import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function ChatMember({ member, chatId, onRemoveChatUser }) {
  const handleRemoveChatUser = () => {
    onRemoveChatUser(chatId, member.user_id);
  };

  return (
    <View
      key={member.user_id}
      className="flex flex-row justify-between pb-2 pt-2"
    >
      <View className="flex items-center p-2 space-x-4">
        <View className="flex-1 min-w-0">
          <Text className="text-sm font-medium text-gray-900 truncate">
            {member.first_name}
            {' '}
            {member.last_name}
          </Text>
          <Text className="text-sm font-medium text-gray-900 truncate">
            {member.email}
          </Text>
        </View>
      </View>
      <View className="flex flex-row space-x-3 items-center">
        <TouchableOpacity onPress={handleRemoveChatUser} className="mt-2 flex">
          <Ionicons name="ios-remove-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatMember;
