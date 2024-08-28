import React from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleNative?: StyleProp<ImageStyle>;
  styleWeb?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
}) {
  const { source, contentFit, styleNative } = props;
  return <Image source={source} style={styleNative} contentFit={contentFit} />;
}
