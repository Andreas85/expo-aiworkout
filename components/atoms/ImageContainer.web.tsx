import React from 'react';
import { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';

export default function ImageContainer(props: {
  source: ImageSourcePropType;
  styleWeb?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  prefixClassWeb?: string;
}) {
  const { source, contentFit, styleWeb, prefixClassWeb } = props;
  return (
    <em className={`${prefixClassWeb}`}>
      <Image source={source} style={styleWeb} contentFit={contentFit} />
    </em>
  );
}
