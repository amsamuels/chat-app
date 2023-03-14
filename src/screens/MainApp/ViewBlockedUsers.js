import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../constants';
import { GetBlockedContacts, UnblockContact } from '../../apiCalls';
import { Feather } from '@expo/vector-icons';
import { ShowToast } from '../../apiCalls';

const ViewBlockedUsers = (props) => {
  const { navigation } = props; // Destructure the navigation prop
  const [blockedContacts, setBlockedContacts] = useState([]); // Set the blocked contacts state
  const [SuccessfullyUnblocked, setSuccessfullyUnblocked] = useState(false); // Set the successfully unblocked state
  const [errorBlocking, setErrorBlocking] = useState(false); // Set the error blocking state
  const [forbidden, setForbidden] = useState(false); // Set the forbidden state
  const [unauthorized, setUnauthorized] = useState(false); // Set the unauthorized state
  const [serverError, setServerError] = useState(false); // Set the server error state

  const getBlockedContacts = async () => {
    // Function to get the blocked contacts
    const getBlockedContacts = await GetBlockedContacts(
      // Call the get blocked contacts api
      setServerError,
      setUnauthorized
    );
    setBlockedContacts(getBlockedContacts); // Set the blocked contacts state
  };
  const handleUnblockContact = async (id) => {
    // Function to unblock a contact
    const unblockContact = await UnblockContact(
      // Call the unblock contact api
      id,
      setSuccessfullyUnblocked,
      setErrorBlocking,
      setForbidden,
      setUnauthorized,
      setServerError
    );
    getBlockedContacts(); // Get the blocked contacts
  };

  useEffect(() => {
    // Use effect to get the blocked contacts
    getBlockedContacts(); // Get the blocked contacts
    if (SuccessfullyUnblocked) {
      // If successfully unblocked
      ShowToast('success', 'Successfully Unblocked Contact'); // Show a toast
    }
    if (errorBlocking) {
      // If there is an error blocking
      ShowToast('error', 'Error Blocking Contact'); // Show a toast
    }
    if (serverError) {
      // If there is a server error
      ShowToast('error', 'Server Error'); // Show a toast
    }
    if (unauthorized) {
      // If unauthorized
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (forbidden) {
      // If forbidden
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
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
