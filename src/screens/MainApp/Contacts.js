import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import {
  SearchUser,
  GetContacts,
  deleteContact,
  BlockContact,
} from '../../apiCalls';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '../../constants';
import * as z from 'zod';

const Contacts = (props) => {
  const { navigation } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [contactBlocked, setContactBlocked] = useState(false); // State to check if contact is blocked
  const [errorBlocking, setErrorBlocking] = useState(false); // State to check if there is an error adding a contact
  const [forbidden, setForbidden] = useState(false); // Set the forbidden state
  const [unauthorized, setUnauthorized] = useState(false); // Set the unauthorized state
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const textSchema = z.string().min(1).max(1000);

  const getContacts = useCallback(async () => {
    const contactsList = await GetContacts();
    setContacts(contactsList);
  });
  const handleSearch = async () => {
    try {
      const search_in = 'contacts';
      const response = await SearchUser(
        textSchema.parse(searchQuery),
        search_in,
        setForbidden,
        setUnauthorized
      );
      setErrorMessage('');
      setContacts(response);
      // Do something with the response data
    } catch (error) {
      // Handle the error
      setErrorMessage(error.message);
    }
  };

  const handleDeleteContact = useCallback(async (id) => {
    try {
      await deleteContact(id);
      getContacts();
    } catch (error) {
      // Handle the error
    }
  });

  const handleBlockContact = useCallback(async (id) => {
    try {
      await BlockContact(id, setContactBlocked, setErrorBlocking);
      getContacts();
    } catch (error) {
      // Handle the error
    }
  });

  useEffect(() => {
    getContacts();
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getContacts();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <View className={'w-full h-full bg-white flex flex-col p-4'}>
        <View className={'flex flex-row justify-between '}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.HOME_STACK)}
            className={'px-2'}
          >
            <Text className={'px-2 py-2 font-semibold  text-lg'}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.ADD_NEW_CONTACT)}
            className={'px-2'}
          >
            <Ionicons name='md-person-add-sharp' size={34} color={'#0ea5e9'} />
          </TouchableOpacity>
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
              className={
                'rounded-lg w-full pl-4  block p-3  mr-8 text-sm text-gray-900 rounded-r-lg  border-l-2 border  bg-gray-50  border-gray-300 focus:ring-blue-500 focus:border-blue-500 '
              }
              placeholder='Search Contacts...'
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
        <>
          <ScrollView>
            <View className='max-w-md divide-y divide-gray-200'>
              {contacts.map((contact) => {
                return (
                  <View
                    key={contact.user_id}
                    className=' flex flex-row justify-between pb-2 pt-2'
                  >
                    <View className='flex items-center p-4 space-x-4'>
                      <View className='flex-1 min-w-0'>
                        {contact.first_name ? (
                          <Text className='text-sm font-medium text-gray-900 truncate'>
                            {contact.first_name} {contact.last_name}
                          </Text>
                        ) : (
                          <Text className='text-sm font-medium text-gray-900 truncate'>
                            {contact.given_name} {contact.family_name}
                          </Text>
                        )}
                        <Text className='text-sm font-medium text-gray-900 truncate'>
                          {contact.email}
                        </Text>
                      </View>
                    </View>
                    <View className='flex flex-row space-x-3 items-center'>
                      <TouchableOpacity
                        onPress={() => handleDeleteContact(contact.user_id)}
                        className='mt-2 flex'
                      >
                        <AntDesign name='delete' size={24} color='black' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleBlockContact(contact.user_id)}
                        className='mt-2 flex'
                      >
                        <Entypo name='block' size={24} color='black' />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </>
      </View>
    </>
  );
};

export default Contacts;
