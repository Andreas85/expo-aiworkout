import React from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleWeb?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
}) {
  const { source, contentFit, styleWeb } = props;
  return <Image source={source} style={styleWeb} contentFit={contentFit} />;
}
