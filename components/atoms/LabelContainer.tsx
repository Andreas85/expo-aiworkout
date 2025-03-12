import { Pressable, StyleProp, TextStyle, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import TextContainer from './TextContainer';

const LabelContainer = (props: {
  label: string;
  left?: ReactNode;
  right?: ReactNode;
  isLoading?: boolean;
  uppercase?: boolean;
  labelStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  isOutline?: boolean;
  onPress?: (event?: GestureResponderEvent) => void | any;
}) => {
  const {
    label,
    right,
    labelStyle,
    left,
    isLoading,
    onPress,
    disabled,
    containerStyle,
    style,
    ...rest
  } = props;
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        tailwind('flex-row items-center gap-x-2 self-center '),
        { opacity: pressed || isLoading ? 0.5 : 1 },
        containerStyle,
      ]}>
      {right}
      {/* <Container style={[tailwind('flex-row items-center gap-x-2 self-center '), containerStyle]}> */}
      <TextContainer data={label} style={[labelStyle]} numberOfLines={1} />
      {left}
      {/* </Container> */}
    </Pressable>
  );
};

export default LabelContainer;
