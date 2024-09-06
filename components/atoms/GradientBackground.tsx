import { ImageBackground, StyleProp, ViewStyle } from 'react-native';
import { IMAGES } from '@/utils/images';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';

interface IGradientBackground {
  children?: React.ReactNode;
  styleWeb?: string;
  styleNative?: StyleProp<ViewStyle>;
}

const GradientBackground = (props: IGradientBackground) => {
  const { children, styleNative } = props;

  return (
    <>
      <ImageBackground
        source={IMAGES.gradientBg}
        resizeMode="stretch"
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          zIndex: 9999999999,
        }}>
        <Container style={[tailwind('flex-1'), styleNative]}>{children}</Container>
      </ImageBackground>
    </>
  );
};

export default GradientBackground;
