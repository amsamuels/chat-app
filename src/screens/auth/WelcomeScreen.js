import { View, Image } from 'react-native';
import React from 'react';
import { Button } from '../../components';
import { icon1 } from '../../../assets';
import { ROUTES } from '../../constants';

function WelcomeScreen(props) {
  const { navigation } = props;
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image className="w-96 h-96" source={icon1} />
      <View className="flex flex-row justify-between w-full px-4 mb-4">
        <Button
          onPress={() => navigation.navigate(ROUTES.REGISTER)}
          text="Sign Up"
        />
        <Button
          onPress={() => navigation.navigate(ROUTES.LOGIN)}
          text="Login"
        />
      </View>
    </View>
  );
}

export default WelcomeScreen;
