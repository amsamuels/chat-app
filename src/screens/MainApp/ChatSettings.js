import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import * as z from 'zod';
import {
  AddUserToChat,
  SearchUser,
  GetChatdetails,
  RemoveUserFromChat,
  UpdateChatDetails,
  ShowToast,
} from '../../apiCalls';
import { ChatMember, ContactComp } from '../../components';
import { ROUTES } from '../../constants';

function ChatSettings(props) {
  const { navigation } = props;
  const { route } = props;
  const { chat_id } = route.params;
  const [contacts, setContacts] = useState([]);
  const [chatDetails, setChatDetails] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [UpdateChatName, setUpdateChatName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const [errorMessage2, setErrorMessage2] = useState(''); // State to store the error message
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);
  const chatSchema = z.string().min(1).max(1000); // Schema to validate the search query

  const handleSearch = async () => {
    try {
      const search_in = 'contacts';
      const response = await SearchUser(
        chatSchema.parse(searchQuery),
        search_in
      );
      setContacts(response);
      // Do something with the response data
    } catch (error) {
      // Handle the error
      setErrorMessage(error.message); // Set the error message
    }
  };
  const handleUpdateChatDetails = async () => {
    try {
      const data = { name: chatSchema.parse(UpdateChatName) };
      setSuccessful(false);
      setError(false);
      setUnauthorized(false);
      setForbidden(false);
      setNotFound(false);
      setServerError(false);
      await UpdateChatDetails(
        chat_id,
        data,
        setSuccessful,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
      setErrorMessage2(error.message); // Set the error message
    }
  };
  const handleAddUserToChat = useCallback(async (chat_id, user_id) => {
    try {
      setSuccessful(false);
      setError(false);
      setUnauthorized(false);
      setForbidden(false);
      setNotFound(false);
      setServerError(false);
      await AddUserToChat(
        chat_id,
        user_id,
        setSuccessful,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
    }
  });
  const handleRemoveChatUser = useCallback(async (chat_id, user_id) => {
    try {
      setSuccessful(false);
      setError(false);
      await RemoveUserFromChat(
        chat_id,
        user_id,
        setSuccessful,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      getChatDetails();
    } catch (error) {
      // Handle the error
    }
  });

  const getChatDetails = async () => {
    try {
      const response = await GetChatdetails(
        chat_id,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      setChatDetails(response);
    } catch (error) {
      // Handle the error
    }
  };
  useEffect(() => {
    getChatDetails();
    if (error) {
      ShowToast('error', 'Request Error');
    }
    if (successful) {
      ShowToast('success', 'Request successful');
    }
    if (unauthorized) {
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (forbidden) {
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (notFound) {
      ShowToast('error', 'Chat not found');
    }
    if (serverError) {
      ShowToast('error', 'Server error');
    }
  }, [successful, unauthorized, error, forbidden, notFound, serverError]);

  return (
    <View className='w-full h-full bg-white flex flex-col p-4'>
      <View className='flex flex-row justify-between items-center p-2'>
        <TouchableOpacity onPress={() => navigation.goBack()} className='px-2'>
          <Text className='px-2 py-2 font-semibold  text-lg'>Back</Text>
        </TouchableOpacity>
        <View>
          <Text className='px-2 py-2 font-semibold  text-center text-lg'>
            Chat Settings
          </Text>
        </View>
        <View>
          <View className='py-6' />
        </View>
      </View>
      <ScrollView>
        {chatDetails && (
          <View className='flex flex-col py-3'>
            <Text className='font-bold text-xl text-center'>
              ADMIN: {chatDetails.creator?.first_name}{' '}
              {chatDetails.creator?.last_name}
            </Text>
          </View>
        )}
        <View className='flex flex-col'>
          <View className='py-3 space-y-4'>
            {errorMessage2 ? (
              <Text className='text-red-500 p-1 text-center'>
                Cannot be empty
              </Text>
            ) : null}
            <TextInput
              onChangeText={(text) => setUpdateChatName(text)}
              className='rounded-lg w-full pl-4  block p-3  text-sm text-gray-900  border-l border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
              placeholder='Change Chat Name'
              defaultValue={chatDetails?.name}
            />
            <TouchableOpacity
              onPress={handleUpdateChatDetails}
              className=' p-2 bg-blue-700 rounded border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
            >
              <Text className='text-xl text-center truncate font-semibold'>
                Update Chat Name
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className='flex p-4'>
          {errorMessage ? (
            <Text className='text-red-500 p-1 text-center'>
              Cannot be empty
            </Text>
          ) : null}
          <View className=' inline-flex flex-row  bg-gray-300/50 rounded-lg '>
            <TextInput
              onChangeText={(text) => setSearchQuery(text)}
              className='rounded-lg w-full pl-4  block p-3  mr-8 text-sm text-gray-900 rounded-r-lg  border-l-2 border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
              placeholder='Search Contacts to add...'
            />
            <TouchableOpacity
              onPress={handleSearch}
              className='absolute top-0 right-0 p-3 bg-blue-700 rounded-r-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
            >
              <FontAwesome5 name='search' size={18} color='black' />
            </TouchableOpacity>
          </View>
        </View>
        {error && (
          <View className='flex flex-col items-center justify-center'>
            <Text className='text-lg font-semibold text-center text-red-600 truncate'>
              User already in chat
            </Text>
          </View>
        )}

        <View className='max-w-md divide-y divide-gray-200'>
          {contacts.map((contact) => (
            <ContactComp
              key={contact.user_id}
              contact={contact}
              chatId={chat_id}
              onAddChatUser={handleAddUserToChat}
            />
          ))}
        </View>
        <View>
          <Text className='text-lg font-semibold text-center text-gray-900 truncate'>
            Chat Members
          </Text>
        </View>

        <View>
          {chatDetails &&
            chatDetails.members.map((member) => (
              <ChatMember
                key={member.user_id}
                member={member}
                chatId={chat_id}
                onRemoveChatUser={handleRemoveChatUser}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default ChatSettings;
