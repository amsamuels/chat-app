import React, { useState, useEffect } from 'react';
import { Modal, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { TimePickerModal } from 'react-native-paper-dates';
import { SendChatMessage } from '../apiCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as z from 'zod';

const ScheduleMessageModal = ({
  showModal,
  onCloseModal,
  onSave,
  setError,
  setUnauthorized,
  setForbidden,
  setNotFound,
  setServerError,
  getChatMessages,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);
  const messageSchema = z.string().min(1).max(1000);
  const handleSaveDraftMessage = () => {
    onSave(scheduleTime);
    onCloseModal();
  };
  const onDismiss = React.useCallback(() => {
    setVisible(false);
  }, [setVisible]);
  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      const selectedTime = new Date();
      selectedTime.setHours(hours);
      selectedTime.setMinutes(minutes);
      setScheduleTime(selectedTime);
      setVisible(false);
    },
    [setVisible]
  );

  const SendScheduledMessages = () => {
    useEffect(() => {
      const interval = setInterval(async () => {
        const existingDrafts = await AsyncStorage.getItem('@drafts');
        const parsedDrafts = existingDrafts ? JSON.parse(existingDrafts) : [];
        const now = new Date(); // get current date and time
        parsedDrafts.forEach(async (draft) => {
          if (draft.timeSchedule && new Date(draft.timeSchedule) <= now) {
            console.log('executing 1st ');
            const messageData = {
              message: messageSchema.parse(draft.sendMessages),
            };
            // send message
            await SendChatMessage(
              messageData,
              draft.chatId,
              setError,
              setUnauthorized,
              setForbidden,
              setNotFound,
              setServerError
            );
            setSendMessages('');
            setErrorMessage('');
            getChatMessages();

            // remove the draft from AsyncStorage
            const filteredDrafts = parsedDrafts.filter(
              (item) => item.messageId !== draft.messageId
            );
            await AsyncStorage.setItem(
              '@drafts',
              JSON.stringify(filteredDrafts)
            );
          } else if (draft.timeSchedule - now <= 0) {
            console.log('executing 2nd ');
            const messageData = {
              message: messageSchema.parse(draft.sendMessages),
            };
            // send message
            await SendChatMessage(
              messageData,
              draft.chatId,
              setError,
              setUnauthorized,
              setForbidden,
              setNotFound,
              setServerError
            );
            setSendMessages('');
            setErrorMessage('');
            getChatMessages();

            // remove the draft from AsyncStorage
            const filteredDrafts = parsedDrafts.filter(
              (item) => item.messageId !== draft.messageId
            );
            await AsyncStorage.setItem(
              '@drafts',
              JSON.stringify(filteredDrafts)
            );
          }
        });
      }, 60000); // check every minute

      return () => clearInterval(interval);
    }, []);

    return null;
  };

  SendScheduledMessages();
  return (
    <Modal visible={showModal} animationType='slide'>
      <View className='w-full h-full bg-white flex flex-col justify-between p-4'>
        <TouchableOpacity
          onPress={() => setVisible(true)}
          uppercase={false}
          mode='outlined'
          className=' rounded-md bg-gray-500 '
        >
          <Text className=' p-4 text-center text-xl  font-bold'>Pick time</Text>
        </TouchableOpacity>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={12}
          minutes={14}
        />
        <TouchableOpacity
          className=' rounded-md bg-gray-500 '
          onPress={handleSaveDraftMessage}
        >
          <Text className=' p-4 text-center text-xl  font-bold'>
            Save as draft or schedule send time
          </Text>
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            className=' rounded-md bg-gray-500 '
            onPress={onCloseModal}
          >
            <Text className=' p-4 text-center text-xl  font-bold'>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ScheduleMessageModal;
