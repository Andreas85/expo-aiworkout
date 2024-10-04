import React from 'react';
import { Text } from '../Themed';
import { StyleProp, TextStyle } from 'react-native';

export default function TextContainer(ITextContainerProps: {
  data?: any;
  style?: StyleProp<TextStyle>; // for native styling
  className?: string; // for web styling (used in .web.tsx)
  numberOfLines?: number;
  onLayout?: (event: any) => void;
}) {
  const { data, style, numberOfLines, ...rest } = ITextContainerProps;
  return (
    <Text {...rest} style={style} numberOfLines={numberOfLines}>
      {data}
    </Text>
  );
}
