import type { ReactNode } from 'react';
import {
  type TouchableWithoutFeedbackProps,
  StyleProp,
  Pressable,
  ViewStyle,
  ActivityIndicator,
  GestureResponderEvent,
} from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { Text } from '../Themed';
import Container from './Container';

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
  onPress: (event?: GestureResponderEvent) => void | any;
} & TouchableWithoutFeedbackProps) {
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={hovered => [
        tailwind(
          `min-h-10 flex-row items-center justify-center rounded-full bg-WORKOUT_PURPLE px-6 py-2 ${disabled ? 'bg-gray-500' : ''}`,
        ),
        hovered && tailwind(''),
        style,
      ]}>
      <Container style={tailwind('flex-row items-center gap-x-2 self-center')}>
        {left}
        <Text
          style={[
            tailwind('text-4  leading-6 text-white'),
            labelStyle,
            { textTransform: uppercase ? 'uppercase' : 'capitalize' },
          ]}>
          {isLoading ? <ActivityIndicator /> : label}
        </Text>
      </Container>
    </Pressable>
  );
}
