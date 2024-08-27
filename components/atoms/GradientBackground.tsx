import { ImageBackground } from 'react-native';
import { IMAGES } from '@/utils/images';
import Container from './Container';
import { tailwind } from '@/utils/tailwind';

interface IGradientBackground {
  children?: React.ReactNode;
}

const GradientBackground = (props: IGradientBackground) => {
  const { children } = props;

  return (
    <>
      <ImageBackground
        source={IMAGES.gradientBg}
        resizeMode="cover"
        style={{
          flex: 1,
          width: '100%',
          zIndex: 9999999999,
        }}>
        <Container style={tailwind('p-4')} className="px-4 py-6  lg:px-32">
          {children}
        </Container>
      </ImageBackground>
    </>
  );
};

export default GradientBackground;
