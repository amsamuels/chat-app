import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { ROUTES } from '../../constants';
import { SendChatMessage, GetChatdetails, DeleteMessage } from '../../apiCalls';
import { Ionicons } from '@expo/vector-icons';
import { formatDuration } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatSceen = (props) => {
  const { navigation } = props;
  const { route } = props;
  const [sendMessages, setSendMessages] = useState('');
  const [SuccessfullyGotMessages, setSuccessfullyGotMessages] = useState(false); // this is to check if the messages were successfully fetched
  const [errorGettingMessages, setErrorGettingMessages] = useState(false); // this is to check if there was an error fetching the messages
  const [errorSendingMesaage, setErrorSendingMesaage] = useState(false); // this is to check if there was an error sending the message
  const [successfullySentMessage, setSuccessfullySentMessage] = useState(false); // this is to check if the message was successfully sent
  const [DeleteMessageSuccess, setDeleteMessageSuccess] = useState(false); // this is to check if the message was successfully deleted
  const [DeleteMessageError, setDeleteMessageError] = useState(false); // this is to check if there was an error deleting the message
  const [chatMessages, setChatMessages] = useState([]);
  const chat_id = route.params.chat_id;

  const handleSendMessage = async () => {
    try {
      const messageData = { message: sendMessages };
      const response = await SendChatMessage(
        messageData,
        chat_id,
        setSuccessfullySentMessage,
        setErrorSendingMesaage
      );
      setSendMessages('');
      Keyboard.dismiss();
      getChatMessages();
    } catch (error) {
      // Handle the error
    }
  };

  const getChatMessages = async () => {
    try {
      setSuccessfullyGotMessages(true);
      setErrorGettingMessages(false);
      const response = await GetChatdetails(
        chat_id,
        setSuccessfullyGotMessages,
        setErrorGettingMessages
      );
      console.log(response);
      setChatMessages(response);
    } catch (error) {
      // Handle the error
    }
  };

  const handleEdit = async (message_id) => {
    console.log(message_id);
  };
  const handleDelete = async (message_id) => {
    try {
      setDeleteMessageSuccess(false);
      setDeleteMessageError(false);
      const response = await DeleteMessage(
        chat_id,
        message_id,
        setDeleteMessageSuccess,
        setDeleteMessageError
      );
      getChatMessages();
    } catch (error) {
      // Handle the error
    }
  };
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('@id');
      setUserId(JSON.parse(id));
    };
    getUserId();
  }, []);
  const { name, messages } = JSON.parse(JSON.stringify(chatMessages));
  const renderItem = ({ item }) => {
    if (item.author.user_id == userId) {
      return (
        <View className='items-end'>
          <View className='border rounded w-52 bg-sky-400 px-2 py-2 mx-2 my-2'>
            <View className='flex flex-row justify-between'>
              <Text className='text-base font-semibold  overflow-hidden'>
                {item.author.first_name}: {item.message}
              </Text>
              <Text>{formatDuration(item.timestamp)}</Text>
            </View>
            <View className='relative inline-block text-left'>
              <>
                <TouchableOpacity
                  onPress={() => {
                    handleDelete(item.message_id);
                  }}
                >
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleEdit(item.message_id);
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View className='border rounded w-52 bg-slate-400 px-2 py-2 mx-2 my-2'>
          <View className='flex flex-row justify-between'>
            <Text className='text-base font-semibold  overflow-hidden'>
              {item.author.first_name}: {item.message}
            </Text>
            <Text>{formatDuration(item.timestamp)}</Text>
          </View>
        </View>
      );
    }
  };

  useEffect(() => {
    getChatMessages();
    if (SuccessfullyGotMessages) {
      console.log(chatMessages);
      // Scroll to the last item in the list
    }
    if (errorGettingMessages) {
      console.log('error');
    }
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getChatMessages();
    });
    return unsubscribe;
  }, [navigation, SuccessfullyGotMessages, errorGettingMessages]);
  return (
    <View
      className={'w-full h-full bg-white flex flex-col justify-between p-4'}
    >
      <View
        className={'basis-20  flex flex-row  items-center justify-between '}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={'px-2'}
        >
          <Text className={'px-2 py-2 font-semibold  text-lg'}>Back</Text>
        </TouchableOpacity>
        <Text className='uppercase font-bold text-center px-2 py-2 overflow-hidden'>
          {name}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(ROUTES.ADD_USER_TO_CHAT, { chat_id: chat_id })
          }
          className={'px-2'}
        >
          <Ionicons name='md-person-add-sharp' size={34} color={'#0ea5e9'} />
        </TouchableOpacity>
      </View>
      <View className='px-2 basis-4/5'>
        <FlatList
          className={'font-semibold text-lg h-full '}
          data={messages}
          renderItem={renderItem}
          inverted={true}
          keyExtractor={(item) => item.message_id.toString()}
        />
      </View>
      <View className='flex p-2'>
        <View className=' inline-flex flex-row  bg-gray-300/50 rounded-lg '>
          <TextInput
            onChangeText={(text) => setSendMessages(text)}
            value={sendMessages}
            className={
              'rounded-lg w-full pl-4  block p-2  mr-4 text-sm text-gray-900 rounded-r-lg  border-l-2 border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
            }
            placeholder='Your Message...'
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className={' top-0 right-0 p-3'}
          >
            <Ionicons name='ios-send' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatSceen;
