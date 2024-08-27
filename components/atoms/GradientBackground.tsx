import { ImageBackground } from 'react-native';
import { IMAGES } from '@/utils/images';

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
        {children}
      </ImageBackground>
    </>
  );
};

export default GradientBackground;
