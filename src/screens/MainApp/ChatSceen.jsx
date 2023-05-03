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
  EditMessage,
  ShowToast,
} from '../../apiCalls';
import { useState, useEffect } from 'react';
import * as z from 'zod';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES } from '../../constants';
import {
  ScheduleMessageModal,
  EditDeleteModal,
  EditModal,
  MessageComp,
} from '../../components';

function ChatSceen(props) {
  const { navigation } = props;
  const { route } = props;
  const { chat_id, message, draftId } = route.params;
  const [sendMessages, setSendMessages] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const messageSchema = z.string().min(1).max(1000);
  const [DeleteMessageSuccess, setDeleteMessageSuccess] = useState(false); // this is to check if the message was successfully deleted
  const [DeleteMessageError, setDeleteMessageError] = useState(false); // this is to check if there was an error deleting the message
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [forbidden, setForbidden] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editedMessage, setEditedMessage] = useState('');

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
  const handlSaveDraftMessage = async (scheduleTime) => {
    try {
      if (scheduleTime) {
        console.log(scheduleTime);
        // send message with schedule time
        const existingDrafts = await AsyncStorage.getItem('@drafts');
        const parsedDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        const totalDrafts = parsedDrafts.length;
        const now = new Date(); // get current date and time
        const updatedDrafts = [
          ...parsedDrafts,
          {
            sendMessages,
            chatId: chat_id,
            messageId: totalDrafts + 1,
            createdAt: now,
            timeSchedule: scheduleTime,
          },
        ];
        await AsyncStorage.setItem('@drafts', JSON.stringify(updatedDrafts)); // Store the drafts array in async storage
        setSendMessages('');
        setErrorMessage('');
      } else {
        // save message as draft
        const existingDrafts = await AsyncStorage.getItem('@drafts');
        const parsedDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        const totalDrafts = parsedDrafts.length;
        const now = new Date(); // get current date and time
        const updatedDrafts = [
          ...parsedDrafts,
          {
            sendMessages,
            chatId: chat_id,
            messageId: totalDrafts + 1,
            createdAt: now,
          },
        ];
        await AsyncStorage.setItem('@drafts', JSON.stringify(updatedDrafts)); // Store the drafts array in async storage
        setSendMessages('');
        setErrorMessage('');
        console.log('Saving message as draft:', message);
      }
      setShowModal(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEdit = (message_id) => {
    setSelectedMessageId(message_id);
    const messageToEdit = messages.find(
      (message) => message.message_id === message_id
    );
    setEditedMessage(messageToEdit.message);
  };

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

  const handleDraft = async () => {
    const messageText = await message;
    setSendMessages(messageText);
    const messageIdToRemove = await draftId; // ID of the message object to remove
    const drafts = await AsyncStorage.getItem('@drafts');
    const messages = JSON.parse(drafts);
    const messageIndex = messages.findIndex(
      (message) => message.messageId === messageIdToRemove
    );

    if (messageIndex !== -1) {
      messages.splice(messageIndex, 1);
      await AsyncStorage.setItem('@drafts', JSON.stringify(messages));
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
  useEffect(() => {
    getChatMessages(); // Call the function on mount

    const interval = setInterval(() => {
      console.log('running this now');
      getChatMessages(); // Call the function every minute
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval
  }, []);
  useEffect(() => {
    if (route.params?.message) {
      handleDraft();
    }
  }, [route.params?.message]);
  useEffect(() => {
    getChatMessages();

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
          <EditModal
            chat_id={chat_id}
            editedMessage={editedMessage}
            setEditedMessage={setEditedMessage}
            selectedMessageId={selectedMessageId}
            setSelectedMessageId={setSelectedMessageId}
            errorMessage2={errorMessage2}
            setErrorMessage2={setErrorMessage2}
            setSuccessful={setSuccessful}
            setError={setError}
            setUnauthorized={setUnauthorized}
            setForbidden={setForbidden}
            setNotFound={setNotFound}
            setServerError={setServerError}
          />
        );
      }
      return (
        // render message with Edit/Delete buttons
        <EditDeleteModal
          author={item.author.first_name}
          message={item.message}
          timestamp={item.timestamp}
          chat_id={chat_id}
          message_id={item.message_id}
          getChatMessages={getChatMessages}
          setSuccessful={setSuccessful}
          setError={setError}
          setUnauthorized={setUnauthorized}
          setForbidden={setForbidden}
          setNotFound={setNotFound}
          setServerError={setServerError}
          handleEdit={handleEdit}
        />
      );
    }
    return (
      // render message without Edit/Delete buttons
      <MessageComp
        author={item.author.first_name}
        message={item.message}
        timestamp={item.timestamp}
      />
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
            className=' top-0 right-0 p-2'
            onPress={() => setShowModal(true)}
          >
            <MaterialIcons name='save-alt' size={24} color='black' />
          </TouchableOpacity>
          <ScheduleMessageModal
            showModal={showModal}
            onCloseModal={handleCloseModal}
            onSave={handlSaveDraftMessage}
            setError={setError}
            setUnauthorized={setUnauthorized}
            setForbidden={setForbidden}
            setNotFound={setNotFound}
            setServerError={setServerError}
            getChatMessages={getChatMessages}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.MESSAGE_DRAFT, {
                chat_id: chat_id,
              })
            }
            className=' top-0 right-0 p-2'
          >
            <MaterialIcons name='drafts' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ChatSceen;
