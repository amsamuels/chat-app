import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROUTES } from '../../constants';

const Draft = (props) => {
  const [draftMessages, setDraftMessages] = useState([]); // store the draft messages
  const { route } = props;
  const { navigation } = props;
  const { chat_id } = route.params;

  const loadDraft = async () => {
    try {
      const drafts = await AsyncStorage.getItem('@drafts');
      if (drafts !== null) {
        const parsedDrafts = JSON.parse(drafts);
        const chatDrafts = parsedDrafts.filter(
          (draft) => draft.chatId === chat_id
        ); // filter drafts for the current chat
        if (chatDrafts.length > 0) {
          setDraftMessages(chatDrafts); // load the first draft for the chat
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    loadDraft();
  }, []);
  const sendMessage = (message, draftId) => {
    // Navigate to the ChatScreen with the message
    navigation.navigate(ROUTES.CHAT_SCREEN, {
      message: message,
      chat_id: chat_id,
      draftId: draftId,
    });
  };
  return (
    <View className='w-full h-full bg-white flex flex-col justify-between p-4'>
      <View>
        <View className='basis-20 flex flex-row items-center space-x-12 '>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className='px-2 py-2 font-semibold  text-center text-lg'>
              Back
            </Text>
          </TouchableOpacity>
          <Text className='uppercase font-bold  items-center text-center px-2 py-2 overflow-hidden'>
            Drafts Messages
          </Text>
        </View>
        <View className='max-w-md divide-y divide-gray-200'>
          {draftMessages.map((draft, index) => (
            <TouchableOpacity
              onPress={() => sendMessage(draft.sendMessages, draft.messageId)}
              key={index}
            >
              <View className='flex items-center p-4 space-x-4'>
                <View className='flex-1 min-w-0'>
                  <Text className=' text-base font-medium text-gray-500 truncate'>
                    {draft.sendMessages}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Draft;
