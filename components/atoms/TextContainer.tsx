import React from 'react';
import { Text } from '../Themed';
import { StyleProp, TextStyle } from 'react-native';

export default function TextContainer(props: {
  data?: any;
  style?: StyleProp<TextStyle>; // for native styling
  className?: string; // for web styling (used in .web.tsx)
}) {
  const { data, style } = props;
  return <Text style={style}>{data}</Text>;
}
