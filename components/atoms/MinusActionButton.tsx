import { Pressable } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const MinusActionButton = (props: { onPressMinus?: () => void }) => {
  const { onPressMinus } = props;
  return (
    <Pressable style={tailwind('')} onPress={onPressMinus}>
      <AntDesign
        name="minus"
        style={tailwind('text-8 rounded-full bg-WORKOUT_VERSION_BACKGROUND p-1')}
        color={Colors.white}
      />
    </Pressable>
  );
};

export default MinusActionButton;
