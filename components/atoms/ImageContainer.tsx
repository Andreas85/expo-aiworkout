import React from 'react';
import { Image, ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleNative?: StyleProp<ImageStyle>;
  styleWeb?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
}) {
  const { source, resizeMode, styleNative } = props;
  return <Image source={source} style={styleNative} resizeMode={resizeMode} />;
}
