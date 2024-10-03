import { Pressable } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import { AntDesign } from '@expo/vector-icons';
import { Href, router } from 'expo-router';

const BackActionButton = (props: { backUrl?: Href<string> }) => {
  const { backUrl } = props;
  const handleBackClick = () => {
    if (backUrl) {
      router.push(backUrl);
      return;
    }
    router.back();
  };
  return (
    <Pressable style={tailwind('mr-auto ')} onPress={handleBackClick}>
      <AntDesign
        name="arrowleft"
        style={tailwind('text-8 rounded-full bg-WORKOUT_VERSION_BACKGROUND p-1')}
        color={'#fff'}
      />
    </Pressable>
  );
};

export default BackActionButton;
