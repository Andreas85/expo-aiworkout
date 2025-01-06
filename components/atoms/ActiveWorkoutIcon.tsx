import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IMAGES } from '@/utils/images';
import { tailwind } from '@/utils/tailwind';
import Container from './Container';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const ActiveWorkoutIcon = () => {
  const { isLargeScreen } = useWebBreakPoints();
  return (
    <Container
      style={Platform.select({
        web: tailwind('absolute right-0 right-4 top-4 z-50'),
        native: tailwind('absolute right-0 right-4 top-4 z-50'),
      })}>
      <Image
        source={IMAGES.workoutactive}
        resizeMode="contain"
        style={Platform.select({
          web: tailwind(
            `aspect-square ${isLargeScreen ? 'h-[20px] w-[20px]' : 'h-[3.4375rem] w-[3.5rem] '} `,
          ),
          native: tailwind('aspect-square h-10 w-10'),
        })}
      />
    </Container>
  );
};

export default ActiveWorkoutIcon;
