import GradientBackground from '@/components/atoms/GradientBackground';
import SignupIndexPage from '@/components/screens/SignUpScreen';
import React from 'react';
import { Platform } from 'react-native';

const Signup = () => {
  return (
    <GradientBackground
      imageStyle={
        Platform.select({
          web: {
            minHeight: '100vh',
          },
        }) as any
      }>
      <SignupIndexPage />
    </GradientBackground>
  );
};

export default Signup;
