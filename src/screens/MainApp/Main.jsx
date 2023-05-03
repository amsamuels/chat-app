import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { GetUser, GetChats, getProfilePhoto } from '../../apiCalls';
import { ROUTES, formatDuration } from '../../constants';

function Main(props) {
  const { navigation } = props;
  const [getChatsSuccess, setGetChatsSuccess] = useState(false);
  const [getChatsError, setGetChatsError] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [chats, setChats] = useState([]);

  async function GetPhoto() {
    const getPhoto = await getProfilePhoto();
    setProfilePhoto(getPhoto);
  }
  async function getChats() {
    setGetChatsSuccess(false);
    setGetChatsError(false);
    const getChats = await GetChats(setGetChatsSuccess, setGetChatsError);
    setChats(getChats);
    console.log(getChats);
  }
  useEffect(() => {
    GetPhoto();
    getChats();
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getChats();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View className='w-full h-full bg-white  flex flex-col p-4'>
      <View className='flex flex-row items-center justify-between '>
        <View className=' p-2 w-fit flex flex-row items-center'>
          <Image
            source={{
              uri: profilePhoto,
            }}
            className='w-10 h-10 rounded-full'
          />
        </View>

        <View className='flex flex-row items-center'>
          <Text className='text-2xl font-bold '>WhatsThat Chats</Text>
        </View>
        <View className='flex flex-row items-center'>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.NEW_CHAT)}
            className='px-2'
          >
            <FontAwesome name='wechat' size={24} color='#0ea5e9' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.CONTACT_STACK)}
            className='px-2'
          >
            <FontAwesome name='users' size={24} color='#0ea5e9' />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className='max-w-md divide-y divide-gray-200'>
          {chats.map((chat) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ROUTES.CHAT_SCREEN, {
                  chat_id: chat.chat_id,
                  name: chat.name,
                })
              }
              key={chat.chat_id}
              className=' flex flex-row justify-between pb-2 pt-2'
            >
              <View className='flex items-center p-4 space-x-4'>
                <View className='flex-1 min-w-0'>
                  <Text className='text-sm font-medium text-gray-900 truncate'>
                    {chat.name}
                  </Text>
                  <Text className='text-sm font-medium text-gray-500 truncate'>
                    {chat.last_message.message}
                  </Text>
                  <Text className='text-sm font-medium text-gray-500 truncate'>
                    {formatDuration(chat.last_message.timestamp)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default Main;
