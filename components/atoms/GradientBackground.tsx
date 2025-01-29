import { ImageBackground, StyleProp, ViewStyle } from 'react-native';
import { IMAGES } from '@/utils/images';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';
import React from 'react';

interface IGradientBackground {
  children?: React.ReactNode;
  styleWeb?: string;
  styleNative?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ViewStyle>;
}

const GradientBackground = (props: IGradientBackground) => {
  const { children, styleNative, imageStyle } = props;

  return (
    <>
      <ImageBackground
        source={IMAGES.gradientBg2}
        resizeMode="stretch"
        style={[
          {
            flex: 1,
            width: '100%',
            height: '100%',
            zIndex: 9999999999,
          },
          imageStyle,
        ]}>
        <Container style={[tailwind('flex-1'), styleNative]}>{children}</Container>
      </ImageBackground>
    </>
  );
};

export default GradientBackground;
