import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import {
  AddUserToChat,
  SearchUser,
  GetChatdetails,
  RemoveUserFromChat,
  UpdateChatDetails,
} from '../../apiCalls';
import { FontAwesome5 } from '@expo/vector-icons';
import { ChatMember, ContactComp } from '../../components';

const ChatSettings = (props) => {
  const { navigation } = props;
  const { route } = props;
  const chat_id = route.params.chat_id;
  const [contacts, setContacts] = useState([]);
  const [chatDetails, setChatDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [UpdateChatName, setUpdateChatName] = useState('');
  const [chatUserAdded, setChatUserAdded] = useState(false);
  const [errorAddingUser, setErrorAddingUser] = useState(false);
  const [SuccessfullyGotMessages, setSuccessfullyGotMessages] = useState(false);
  const [errorGettingMessages, setErrorGettingMessages] = useState(false);
  const [userInChat, setUserInChat] = useState(false);
  const [successfullyUpdatedChat, setSuccessfullyUpdatedChat] = useState(false);
  const [errorUpdatingChat, setErrorUpdatingChat] = useState(false);

  const handleSearch = async () => {
    try {
      const search_in = 'contacts';
      const response = await SearchUser(searchQuery, search_in);
      setContacts(response);
      // Do something with the response data
    } catch (error) {
      // Handle the error
    }
  };
  const handleUpdateChatDetails = async () => {
    try {
      const data = { name: UpdateChatName };
      const response = await UpdateChatDetails(
        chat_id,
        data,
        setSuccessfullyUpdatedChat,
        setErrorUpdatingChat
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
    }
  };
  const handleAddUserToChat = useCallback(async (chat_id, user_id) => {
    try {
      setChatUserAdded(false);
      setUserInChat(false);
      setErrorAddingUser(false);
      const add = await AddUserToChat(
        chat_id,
        user_id,
        setChatUserAdded,
        setUserInChat,
        setErrorAddingUser
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
    }
  });
  const handleRemoveChatUser = useCallback(async (chat_id, user_id) => {
    try {
      setChatUserAdded(false);
      setUserInChat(false);
      setErrorAddingUser(false);
      const remove = await RemoveUserFromChat(
        chat_id,
        user_id,
        setChatUserAdded,
        setUserInChat,
        setErrorAddingUser
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
    }
  });

  const getChatDetails = async () => {
    try {
      setSuccessfullyGotMessages(true);
      setErrorGettingMessages(false);
      const response = await GetChatdetails(
        chat_id,
        setSuccessfullyGotMessages,
        setErrorGettingMessages
      );
      console.log(response);
      setChatDetails(response);
    } catch (error) {
      // Handle the error
    }
  };
  useEffect(() => {
    getChatDetails();
    if (SuccessfullyGotMessages) {
      console.log(chatMessages);
    }
    if (errorGettingMessages) {
      console.log('error');
    }
  }, []);

  return (
    <View className={'w-full h-full bg-white flex flex-col p-4'}>
      <View className='flex flex-row justify-between items-center p-2'>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={'px-2'}
        >
          <Text className={'px-2 py-2 font-semibold  text-lg'}>Back</Text>
        </TouchableOpacity>
        <View>
          <Text className={'px-2 py-2 font-semibold  text-lg'}>
            Chat Settings
          </Text>
        </View>
        <View>
          <View className={'py-6'}></View>
        </View>
      </View>
      <ScrollView>
        {chatDetails && (
          <View className={'flex flex-col py-3'}>
            <Text className={'font-bold text-xl text-center'}>
              ADMIN: {chatDetails.creator?.first_name}{' '}
              {chatDetails.creator?.last_name}
            </Text>
          </View>
        )}
        <View className={'flex flex-col'}>
          <View className={'py-3 space-y-4'}>
            <TextInput
              onChangeText={(text) => setUpdateChatName(text)}
              className={
                'rounded-lg w-full pl-4  block p-3  text-sm text-gray-900  border-l border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
              }
              placeholder='Change Chat Name'
              defaultValue={chatDetails?.name}
            />
            <TouchableOpacity
              onPress={handleUpdateChatDetails}
              className={
                ' p-2 bg-blue-700 rounded border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
              }
            >
              <Text className='text-xl text-center truncate font-semibold'>
                Update Chat Name
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className='flex p-4'>
          <View className=' inline-flex flex-row  bg-gray-300/50 rounded-lg '>
            <TextInput
              onChangeText={(text) => setSearchQuery(text)}
              className={
                'rounded-lg w-full pl-4  block p-3  mr-8 text-sm text-gray-900 rounded-r-lg  border-l-2 border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
              }
              placeholder='Search Contacts to add...'
            />
            <TouchableOpacity
              onPress={handleSearch}
              className={
                'absolute top-0 right-0 p-3 bg-blue-700 rounded-r-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
              }
            >
              <FontAwesome5 name='search' size={18} color='black' />
            </TouchableOpacity>
          </View>
        </View>

        <View className='max-w-md divide-y divide-gray-200'>
          {contacts.map((contact) => {
            return (
              <ContactComp
                key={contact.user_id}
                contact={contact}
                chatId={chat_id}
                onAddChatUser={handleAddUserToChat}
              />
            );
          })}
        </View>
        <View>
          <Text className='text-lg font-semibold text-center text-gray-900 truncate'>
            Chat Members
          </Text>
        </View>
        <View>
          {chatDetails &&
            chatDetails.members.map((member) => {
              return (
                <ChatMember
                  key={member.user_id}
                  member={member}
                  chatId={chat_id}
                  onRemoveChatUser={handleRemoveChatUser}
                />
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChatSettings;
