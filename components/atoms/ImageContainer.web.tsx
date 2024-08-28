import React from 'react';
import { Image, ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleWeb?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
}) {
  const { source, resizeMode, styleWeb } = props;
  return <Image source={source} style={styleWeb} resizeMode={resizeMode} />;
}
