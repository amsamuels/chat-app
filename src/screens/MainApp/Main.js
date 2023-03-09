import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { GetUser } from '../../apiCalls';
import { FontAwesome } from '@expo/vector-icons';
import { ROUTES } from '../../constants';
import { GetChats, getProfilePhoto } from '../../apiCalls';
import { formatDuration } from '../../constants';

const Main = (props) => {
  const { navigation } = props;
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [getChatsSuccess, setGetChatsSuccess] = useState(false);
  const [getChatsError, setGetChatsError] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function getUser() {
      const getUser = await GetUser();
      setProfile(getUser);
    }
    async function GetPhoto() {
      const getPhoto = await getProfilePhoto();
      setProfilePhoto(getPhoto);
      getUser();
    }
    GetPhoto();
    async function getChats() {
      setGetChatsSuccess(false);
      setGetChatsError(false);
      const getChats = await GetChats(setGetChatsSuccess, setGetChatsError);
      setChats(getChats);
      console.log(getChats);
    }
    getChats();
    getUser();
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getChats();
      getUser();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View className={'w-full h-full bg-white flex flex-col p-4'}>
      <View className={'flex flex-row items-center justify-between '}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.PROFILE)}
          className={' p-2 w-fit flex flex-row items-center'}
        >
          <Image
            source={{
              uri: profilePhoto,
            }}
            className={'w-10 h-10 rounded-full'}
          />

          <Text className={'px-2 py-2 font-semibold  text-lg'}>Samuel</Text>
        </TouchableOpacity>
        <View className={'flex flex-row items-center'}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.NEW_CHAT)}
            className={'px-2'}
          >
            <FontAwesome name='wechat' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.CONTACTS)}
            className={'px-2'}
          >
            <FontAwesome name='users' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className='max-w-md divide-y divide-gray-200'>
          {chats.map((chat) => {
            return (
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
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Main;
