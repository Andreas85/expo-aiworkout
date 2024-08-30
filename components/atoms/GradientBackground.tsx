import { ImageBackground, Platform, StyleProp, ViewStyle } from 'react-native';
import { IMAGES } from '@/utils/images';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';

interface IGradientBackground {
  children?: React.ReactNode;
  styleWeb?: string;
  styleNative?: StyleProp<ViewStyle>;
}

const GradientBackground = (props: IGradientBackground) => {
  const { children, styleNative, styleWeb } = props;

  return (
    <>
      <ImageBackground
        source={Platform.OS === 'web' ? '' : IMAGES.gradientBg}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
          zIndex: 9999999999,
        }}>
        <Container
          style={[tailwind('flex-1'), styleNative]}
          className={`mt-28 min-h-full px-4 pb-6 lg:px-32 ${styleWeb}`}>
          {children}
        </Container>
      </ImageBackground>
    </>
  );
};

export default GradientBackground;
