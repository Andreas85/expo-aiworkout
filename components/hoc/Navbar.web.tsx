import React from 'react';
import { Link, Slot } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { View, Text } from '../Themed';

const Navbar = () => {
  return (
    <>
      <View
        style={tailwind(
          'bg-NAVBAR_BACKGROUND flex h-24 flex-row items-center justify-between gap-4 px-24',
        )}>
        <Text>
          <Link href="/">Home</Link>
        </Text>
        <Text>
          <Link href="/two">Two</Link>
        </Text>
      </View>
      <Slot />
    </>
  );
};

export default Navbar;
