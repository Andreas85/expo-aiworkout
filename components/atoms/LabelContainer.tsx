import { Pressable, StyleProp, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import TextContainer from './TextContainer';

const LabelContainer = (props: {
  label: string;
  left?: ReactNode;
  isLoading?: boolean;
  uppercase?: boolean;
  labelStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  isOutline?: boolean;
  onPress?: (event?: GestureResponderEvent) => void | any;
}) => {
  const { label, labelStyle, left, isLoading, onPress, disabled, containerStyle, style, ...rest } =
    props;
  return (
    <Pressable
      {...rest}
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        tailwind('flex-row items-center gap-x-2 self-center '),
        { opacity: pressed ? 0.5 : 1 },
        containerStyle,
      ]}>
      {/* <Container style={[tailwind('flex-row items-center gap-x-2 self-center '), containerStyle]}> */}
      <TextContainer data={label} style={[labelStyle]} />
      {left}
      {/* </Container> */}
    </Pressable>
  );
};

export default LabelContainer;
