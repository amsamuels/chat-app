import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import {
  SendChatMessage,
  GetChatdetails,
  DeleteMessage,
  EditMessage,
  ShowToast,
} from '../../apiCalls';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES, formatDuration } from '../../constants';
import StoreData from '../../apiCalls/StoreData';

function ChatSceen(props) {
  const { navigation } = props;
  const { route } = props;
  const [draft, setDraft] = useState('');
  const [sendMessages, setSendMessages] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const { chat_id } = route.params;
  const messageSchema = z.string().min(1).max(1000);
  const [DeleteMessageSuccess, setDeleteMessageSuccess] = useState(false); // this is to check if the message was successfully deleted
  const [DeleteMessageError, setDeleteMessageError] = useState(false); // this is to check if there was an error deleting the message
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);
  const handleSendMessage = async () => {
    try {
      Keyboard.dismiss();
      const messageData = { message: messageSchema.parse(sendMessages) };
      await SendChatMessage(
        messageData,
        chat_id,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      setSendMessages('');
      setErrorMessage('');
      getChatMessages();
    } catch (error) {
      // Handle the error
      setErrorMessage(error.message);
    }
  };
  const handlSaveMessage = async () => {
    try {
      Keyboard.dismiss();
      StoreData('draft', messageSchema.parse(sendMessages)); // Store the token in async storage
      setSendMessages('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const loadDraft = async () => {
    try {
      const draft = await AsyncStorage.getItem('@draft');
      if (draft !== null) {
        setSendMessages(draft);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getChatMessages = async () => {
    try {
      const response = await GetChatdetails(
        chat_id,
        setError,
        setUnauthorized,
        setForbidden,
        setNotFound,
        setServerError
      );
      setChatMessages(response);
    } catch (error) {
      // Handle the error
    }
  };

  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const handleEdit = (message_id) => {
    setSelectedMessageId(message_id);
    const messageToEdit = messages.find(
      (message) => message.message_id === message_id
    );
    setEditedMessage(messageToEdit.message);
  };

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

  const handleDelete = async (message_id) => {
    try {
      setDeleteMessageSuccess(false);
      setDeleteMessageError(false);
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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    getChatMessages();
    const getUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('@id');
        setUserId(JSON.parse(id));
      } catch (error) {
        // Handle the error
        console.log('Could not retrive user Id ', error);
        await AsyncStorage.removeItem('@id');
        await AsyncStorage.removeItem('@token');
        navigation.navigate(ROUTES.LOGIN);
      }
    };
    getUserId();

    if (successful) {
      ShowToast('success', 'Request successful');
    }
    if (error) {
      // Handle the error
      ShowToast('error', 'Error Something went wrong');
    }
    if (unauthorized) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (forbidden) {
      // Handle the error
      navigation.navigate(ROUTES.LOGIN);
    }
    if (notFound) {
      // Handle the error
      ShowToast('error', 'Not found');
    }
    if (serverError) {
      // Handle the error
      ShowToast('error', 'Server error');
    }
    if (DeleteMessageError) {
      // Handle the error
    }

    if (DeleteMessageSuccess) {
      getChatMessages();
    }
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getChatMessages();
    });
    return unsubscribe;
  }, [error, successful, unauthorized, forbidden, notFound, serverError]);

  const { name, messages } = JSON.parse(JSON.stringify(chatMessages));
  const renderItem = ({ item }) => {
    if (item.author.user_id == userId) {
      if (selectedMessageId === item.message_id) {
        return (
          // render edit modal
          <View className=' inset-0  bg-opacity-50'>
            <View className='relative bg-white mx-auto w-80 my-10 p-4 rounded-lg'>
              <TextInput
                value={editedMessage}
                onChangeText={setEditedMessage}
                className='border-b pb-1 mb-4 w-full'
              />
              {errorMessage2 ? (
                <Text className='text-red-500 p-1 text-center'>
                  Cannot be empty
                </Text>
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
      }
      return (
        // render message with Edit/Delete buttons
        <View className='items-end'>
          <View className='border rounded w-52 bg-sky-400 px-2 py-2 mx-2 my-2'>
            <View className='flex flex-row justify-between'>
              <Text className='text-base font-semibold  overflow-hidden'>
                {item.author.first_name}:{item.message}
              </Text>
              <Text>{formatDuration(item.timestamp)}</Text>
            </View>
            <View className='relative inline-block text-left'>
              <View className='flex flex-row space-x-3'>
                <TouchableOpacity
                  className='border rounded bg-sky-400 px-2 py-2 mx-2 my-2'
                  onPress={() => {
                    handleDelete(item.message_id);
                  }}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className='border rounded bg-sky-400 px-2 py-2 mx-2 my-2'
                  onPress={() => {
                    handleEdit(item.message_id);
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return (
      // render message without Edit/Delete buttons
      <View className='border rounded w-52 bg-slate-400 px-2 py-2 mx-2 my-2'>
        <View className='flex flex-row justify-between'>
          <Text className='text-base font-semibold  overflow-hidden'>
            {item.author.first_name}:{item.message}
          </Text>
          <Text>{formatDuration(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className='w-full h-full bg-white flex flex-col justify-between p-4'>
      <View className='basis-20  flex flex-row  items-center justify-between '>
        <TouchableOpacity onPress={() => navigation.goBack()} className='px-2'>
          <Text className='px-2 py-2 font-semibold  text-lg'>Back</Text>
        </TouchableOpacity>
        <Text className='uppercase font-bold text-center px-2 py-2 overflow-hidden'>
          {name}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTES.ADD_USER_TO_CHAT, { chat_id })
          }
          className='px-2'
        >
          <Ionicons name='md-person-add-sharp' size={34} color='#0ea5e9' />
        </TouchableOpacity>
      </View>
      <View className='px-2 basis-4/5'>
        <FlatList
          className='font-semibold text-lg h-full '
          data={messages}
          renderItem={renderItem}
          inverted
          keyExtractor={(item) => item.message_id.toString()}
        />
      </View>
      <View className='flex p-2'>
        {errorMessage ? (
          <Text className='text-red-500 p-1 text-center'>
            Please Enter Your message
          </Text>
        ) : null}
        <View className=' inline-flex flex-row  bg-gray-300/50 rounded-lg '>
          <TextInput
            onChangeText={(text) => setSendMessages(text)}
            multiline
            value={sendMessages}
            className='rounded-lg w-full block p-2 text-sm text-gray-900 rounded-r-lg  border-l-2 border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
            placeholder='Your Message...'
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className=' top-0 right-0 p-2'
          >
            <Ionicons name='ios-send' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlSaveMessage}
            className=' top-0 right-0 p-2'
          >
            <MaterialIcons name='save-alt' size={24} color='black' />
          </TouchableOpacity>
          <TouchableOpacity onPress={loadDraft} className=' top-0 right-0 p-2'>
            <MaterialIcons name='drafts' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ChatSceen;
