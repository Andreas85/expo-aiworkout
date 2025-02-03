import React from 'react';
import { Stack } from 'expo-router';

const Navbar = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="workout/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="workout/public/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="start-workout/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="workout-session/[slug]" options={{ headerShown: false }} />
      <Stack.Screen name="workout-session/[slug]/detail" options={{ headerShown: false }} />
      <Stack.Screen name="workout-session/[slug]/info" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Navbar;
