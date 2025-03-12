import { Platform, Pressable } from 'react-native';
import React from 'react';
import { tailwind } from '@/utils/tailwind';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const PlusActionButton = (props: { onPressPlus?: () => void }) => {
  const { onPressPlus } = props;
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Pressable style={tailwind(' ')} onPress={onPressPlus}>
      <AntDesign
        name="plus"
        style={Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'text-6' : 'text-8'} rounded-full bg-WORKOUT_VERSION_BACKGROUND p-1`,
          ),
          native: tailwind('text-6 rounded-full bg-WORKOUT_VERSION_BACKGROUND p-1'),
        })}
        color={Colors.white}
      />
    </Pressable>
  );
};

export default PlusActionButton;
