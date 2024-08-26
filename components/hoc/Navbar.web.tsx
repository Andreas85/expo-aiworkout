import React from 'react';
import { Link, router, Slot } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { Text, View } from '../Themed';
import { ActionButton } from '../atoms/ActionButton';

const Navbar = () => {
  return (
    <>
      <View
        style={tailwind(
          'flex h-24 flex-row items-center justify-between gap-4 bg-NAVBAR_BACKGROUND px-24',
        )}>
        <Text>
          <Link href="/">logo</Link>
        </Text>
        <ActionButton label={'Sign in'} onPress={() => router.push('/signin')} />
      </View>
      <Slot />
    </>
  );
};

export default Navbar;
