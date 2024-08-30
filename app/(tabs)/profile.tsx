import GradientBackground from '@/components/atoms/GradientBackground';
import React from 'react';
import Container from '@/components/atoms/Container';
import TextContainer from '@/components/atoms/TextContainer';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { tailwind } from '@/utils/tailwind';

const Signin = () => {
  const insets = useSafeAreaInsets();
  // const { isAuthenticated } = useAuthStore();
  return (
    <SafeAreaView style={[tailwind('flex-1'), { marginTop: insets.top }]}>
      <GradientBackground>
        <Container>
          <TextContainer data={'Profile'} />
        </Container>
      </GradientBackground>
    </SafeAreaView>
  );
};

export default Signin;
