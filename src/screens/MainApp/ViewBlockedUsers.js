import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants';
import { GetBlockedContacts, UnblockContact } from '../../apiCalls';
import { Feather } from '@expo/vector-icons';
import { ShowToast } from '../../apiCalls';

const ViewBlockedUsers = (props) => {
  const { navigation } = props;
  const [blockedContacts, setBlockedContacts] = useState([]);
  const [SuccessfullyUnblocked, setSuccessfullyUnblocked] = useState(false);
  const [errorBlocking, setErrorBlocking] = useState(false);

  const getBlockedContacts = async () => {
    const getBlockedContacts = await GetBlockedContacts();
    setBlockedContacts(getBlockedContacts);
    console.log(getBlockedContacts);
  };
  const handleUnblockContact = async (id) => {
    const unblockContact = await UnblockContact(
      id,
      setSuccessfullyUnblocked,
      setErrorBlocking
    );
    getBlockedContacts();
  };

  useEffect(() => {
    getBlockedContacts();
    if (SuccessfullyUnblocked) {
      const toast = ShowToast('success', 'Successfully Unblocked Contact');
      setTimeout(() => {
        // Hide toast after 2 seconds
        toast?.hide();
      }, 2000);
    }
  }, [SuccessfullyUnblocked]);

  return (
    <View className={'w-full h-full bg-white flex flex-col p-4'}>
      <View className={'flex flex-row justify-between '}>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.SETTING)}
          className={'px-2'}
        >
          <Text className={'px-2 py-2 font-semibold  text-lg'}>Back</Text>
        </TouchableOpacity>
        <Text className={'px-2 py-2 font-semibold  text-lg'}>
          Blocked Contacts
        </Text>
        <View className={'px-2'} />
      </View>
      <ScrollView>
        <View className='max-w-md divide-y divide-gray-200'>
          {blockedContacts.map((contact) => {
            return (
              <View
                key={contact.user_id}
                className=' flex flex-row justify-between pb-2 pt-2'
              >
                <View className='flex items-center p-4 space-x-4'>
                  <View className='flex-1 min-w-0'>
                    <Text className='text-sm font-medium text-gray-900 truncate'>
                      {contact.first_name} {contact.last_name}
                    </Text>

                    <Text className='text-sm font-medium text-gray-900 truncate'>
                      {contact.email}
                    </Text>
                  </View>
                </View>
                <View className='flex flex-row space-x-3 items-center'>
                  <TouchableOpacity
                    onPress={() => handleUnblockContact(contact.user_id)}
                    className='mt-2 flex'
                  >
                    <Feather name='user-plus' size={24} color='black' />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ViewBlockedUsers;
