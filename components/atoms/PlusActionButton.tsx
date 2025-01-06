import { Pressable } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

const PlusActionButton = (props: { onPressPlus?: () => void }) => {
  const { onPressPlus } = props;

  return (
    <Pressable style={tailwind(' ')} onPress={onPressPlus}>
      <AntDesign
        name="plus"
        style={tailwind('text-8 rounded-full bg-WORKOUT_VERSION_BACKGROUND p-1')}
        color={Colors.white}
      />
    </Pressable>
  );
};

export default PlusActionButton;
