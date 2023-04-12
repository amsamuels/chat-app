import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

import * as z from 'zod';
import { SearchUser, AddContact, ShowToast } from '../../apiCalls';
import { ROUTES } from '../../constants';

function AddNewContact(props) {
  const { navigation } = props; // Destructure the navigation prop
  const [contactAdded, setContactAdded] = useState(false); // State to check if contact is added
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [addError, setAddError] = useState(false); // State to check if there is an error adding a contact
  const [contactSearchResult, setContactSearchResult] = useState([]); // State to store the search result
  const searchSchema = z.string().min(1).max(1000); // Schema to validate the search query
  const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
  const [forbidden, setForbidden] = useState(false); // Set the forbidden state
  const [unauthorized, setUnauthorized] = useState(false); // Set the unauthorized state
  const [cannoAddyourself, setCannoAddyourself] = useState(false); // Set the unauthorized state
  const [serverError, setServerError] = useState(false); // Set the server error state
  const [offset, setOffset] = useState(0);
  const handleSearch = async () => {
    try {
      const search_in = 'all'; // Search in all fields
      const amount = 5; // Amount of results to return
      const response = await SearchUser(
        searchSchema.parse(searchQuery), // Parse the search query
        search_in,
        amount,
        offset,
        setForbidden,
        setUnauthorized
      );

      setContactSearchResult((prevResults) => [...prevResults, ...response]); // Append new results
      setOffset((prevPageNumber) => prevPageNumber + 1);
      // Do something with the response data
    } catch (error) {
      // Handle the error
      setErrorMessage(error.message); // Set the error message
    }
  };
  const amount = 5; // Amount of results to return

  const handleAddContact = async (id) => {
    try {
      setContactAdded(false); // Set contact added to false
      setAddError(false); // Set add error to false
      await AddContact(
        id,
        setContactAdded,
        setAddError,
        setForbidden,
        setUnauthorized,
        setCannoAddyourself,
        setServerError
      ); // Call the add contact api
      setContactAdded(true); // Set contact added to true
      setTimeout(() => {
        ShowToast('success', 'Contact Added Successfully'); // Show a toast
      }, 1000);
      // Do something with the response data
    } catch (error) {
      setAddError(true); // Set add error to true
      ShowToast('error', 'Error Adding Contact'); // Show a toast
      // Handle the error
    }
  };
  useEffect(() => {
    if (forbidden) {
      // If forbidden is true
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (unauthorized) {
      // If unauthorized is true
      navigation.navigate(ROUTES.LOGIN); // Navigate to the login screen
    }
    if (cannoAddyourself) {
      // If unauthorized is true
      ShowToast('error', 'Cannot add yourself'); // Show a toast
    }
    if (serverError) {
      // If unauthorized is true
      ShowToast('error', 'Server Error'); // Show a toast
    }
  }, [forbidden, unauthorized, cannoAddyourself, serverError]);
  return (
    <View className='w-full h-full bg-white flex flex-col p-4'>
      <View className='basis-20 flex flex-row items-center space-x-12 '>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.CONTACTS)}
          className='px-2'
        >
          <Text className=' text-lg'>Cancel</Text>
        </TouchableOpacity>
        <Text className='uppercase font-bold  items-center text-center px-2 py-2 overflow-hidden'>
          ADD NEW CONTACTS
        </Text>
      </View>
      <>
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
              placeholder='Search Contacts...'
            />
            <TouchableOpacity
              onPress={handleSearch}
              className='absolute top-0 right-0 p-3 bg-blue-700 rounded-r-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300'
            >
              <FontAwesome5 name='search' size={18} color='black' />
            </TouchableOpacity>
          </View>
        </View>
      </>
      <>
        <ScrollView>
          <View className='max-w-md divide-y divide-gray-200'>
            {contactSearchResult.map((contact, index) => (
              <View
                key={index}
                className=' flex flex-row justify-between pb-2 pt-2'
              >
                <View className='flex items-center p-4 space-x-4'>
                  <View className='flex-1 min-w-0'>
                    <Text className='text-sm font-medium text-gray-900 truncate'>
                      {contact.given_name} {contact.family_name}
                    </Text>

                    <Text className='text-sm font-medium text-gray-900 truncate'>
                      {contact.email}
                    </Text>
                  </View>
                </View>
                <View className='flex flex-row space-x-3 items-center'>
                  <TouchableOpacity
                    onPress={() => handleAddContact(contact.user_id)}
                    className='mt-2 flex'
                  >
                    <Ionicons name='add' size={24} color='black' />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity
              title='Load More'
              onPress={handleSearch}
              className='flex flex-row justify-center items-center p-4'
            >
              <Text className='text-sm font-medium text-gray-900 truncate'>
                Load More
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </>
    </View>
  );
}

export default AddNewContact;
