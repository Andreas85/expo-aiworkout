import GradientBackground from '@/components/atoms/GradientBackground';
import React from 'react';
import SignInIndexPage from '../signin';

const Signin = () => {
  return (
    <GradientBackground styleWeb="!p-0 lg:dynamic-height overflow-y !mt-0">
      <SignInIndexPage />
    </GradientBackground>
  );
};

export default Signin;
