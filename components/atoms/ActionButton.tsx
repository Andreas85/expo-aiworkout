import type { ReactNode } from 'react';
import {
  type TouchableWithoutFeedbackProps,
  View,
  StyleProp,
  Pressable,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { Text } from '../Themed';

export function ActionButton({
  label,
  labelStyle,
  style,
  left,
  isLoading,
  uppercase = false,
  onPress,
  disabled,
  ...rest
}: {
  label: string;
  left?: ReactNode;
  isLoading?: boolean;
  uppercase?: boolean;
  labelStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?(): void;
} & TouchableWithoutFeedbackProps) {
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled}
      style={hovered => [
        tailwind(
          `bg-WORKOUT_PURPLE h-10 flex-row items-center justify-center rounded-full px-6 py-3 ${disabled ? 'bg-gray-500' : ''}`,
        ),
        hovered && tailwind(''),
        style,
      ]}>
      <View style={tailwind('flex-row items-center')}>
        {left}
        <Text
          style={[
            tailwind('text-4 font-bold leading-6 text-white'),
            labelStyle,
            { textTransform: uppercase ? 'uppercase' : 'capitalize' },
          ]}>
          {isLoading ? <ActivityIndicator /> : label}
        </Text>
      </View>
    </Pressable>
  );
}
