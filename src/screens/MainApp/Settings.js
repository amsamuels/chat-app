import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import { ROUTES } from '../../constants';
import { useEffect, useState } from 'react';
import {
  GetUser,
  pickImage,
  UploadUserPhoto,
  getProfilePhoto,
  LogOut,
  ShowToast,
} from '../../apiCalls';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Settings = (props) => {
  const { navigation } = props;
  const [profile, setProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errorGettingUser, setErrorGettingUser] = useState(false);
  const [getUserSuccess, setGetUserSuccess] = useState(false);
  const [Unauthorized, setUnauthorized] = useState(false);
  const [ServerError, setServerError] = useState(false);

  async function getUser() {
    setErrorGettingUser(false);
    setGetUserSuccess(true);
    setServerError(false);
    setUnauthorized(false);
    const getUser = await GetUser(
      setGetUserSuccess,
      setUnauthorized,
      setErrorGettingUser,
      setServerError
    );
    setProfile(getUser);
  }
  async function GetPhoto() {
    const getPhoto = await getProfilePhoto();
    setProfilePhoto(getPhoto);
    getUser();
  }
  const handleLogout = async () => {
    const res = await LogOut();

    navigation.navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    getUser();
    GetPhoto();
    if (errorGettingUser) {
      navigation.navigate(ROUTES.LOGIN);
    }
    if (Unauthorized) {
      navigation.navigate(ROUTES.LOGIN);
    }

    if (ServerError) {
      // If there is a server error
      ShowToast('error', 'Sorry Server Error. Try again.'); // Show a toast
    }
    const unsubscribe = navigation.addListener('focus', () => {
      // Call the functions that fetch data again to update the state
      getUser();
      GetPhoto();
    });

    return unsubscribe;
  }, [navigation]);

  const getImg = async () => {
    const img = await pickImage();
    if (img) {
      let newImg = { img };
      await UploadUserPhoto(newImg);
      GetPhoto();
    }
    GetPhoto();
  };

  return (
    <ScrollView>
      <View className={'h-full bg-neutral-900 '}>
        <View className={' flex flex-col items-center pt-7'}>
          <Image
            source={{
              uri: profilePhoto,
            }}
            width={100}
            height={100}
            className={' w-48 h-48  rounded '}
          />
          <View className={'flex flex-col py-3'}>
            <Text className={'font-bold text-3xl text-white'}>
              {profile?.first_name} {profile?.last_name}
            </Text>
            <Text
              className={'font-semibold text-lg text-center pt-2 text-gray-500'}
            >
              {profile?.email}
            </Text>
          </View>
        </View>
        <View
          className={'flex flex-col space-y-4 py-4 items-center justify-center'}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className={
              'inline-flex flex-row w-72 h-11 overflow-hidden bg-gray-600/50  rounded-lg group'
            }
            onPress={getImg}
          >
            <View className={'px-3.5 py-2 flex items-center justify-center'}>
              <AntDesign name='camerao' size={24} color={'#0ea5e9'} />
            </View>
            <Text
              className={
                ' py-2.5 text-center text-base font-semibold text-blue-700'
              }
            >
              Change Profile Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
            className={
              'inline-flex flex-row w-72 h-11 items-center overflow-hidden bg-gray-600/50  rounded-lg group'
            }
          >
            <View className={'px-3.5 py-2 flex items-center justify-center'}>
              <FontAwesome5 name='user-edit' size={24} color={'#0ea5e9'} />
            </View>
            <Text
              className={
                ' py-2.5 text-center text-base font-semibold text-blue-700'
              }
            >
              Update Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.VIEW_BLOCKED_USERS)}
            className={
              'inline-flex flex-row w-72 h-11 items-center overflow-hidden bg-gray-600/50  rounded-lg group'
            }
          >
            <View className={'px-3.5 py-2 flex items-center justify-center'}>
              <Ionicons
                name='md-person-add-sharp'
                size={34}
                color={'#0ea5e9'}
              />
            </View>
            <Text
              className={
                ' py-2.5 text-center text-base font-semibold text-blue-700'
              }
            >
              View Blocked Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleLogout()}
            className={
              'inline-flex flex-row w-72 h-11 items-center overflow-hidden bg-gray-600/50  rounded-lg group'
            }
          >
            <View className={'px-3.5 py-2 flex items-center justify-center'}>
              <Ionicons
                name='md-person-add-sharp'
                size={34}
                color={'#0ea5e9'}
              />
            </View>
            <Text
              className={
                ' py-2.5 text-center text-base font-semibold text-blue-700'
              }
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Settings;
