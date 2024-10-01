import React from 'react';
import { View } from '../Themed';
import { StyleProp, ViewStyle } from 'react-native';

export default function Container(props: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>; // for native styling
  className?: string; // for web styling (used in .web.tsx)
}) {
  const { children, style, ...rest } = props;
  return (
    <View style={style} darkColor={'transparent'} {...rest}>
      {children}
    </View>
  );
}
