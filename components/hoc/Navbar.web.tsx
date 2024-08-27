import React from 'react';
import { Link, router, Slot } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import { Image } from 'react-native';
import { IMAGES } from '@/utils/images';

const Navbar = () => {
  return (
    <>
      <div
        className={
          'flex h-24 flex-row items-center justify-between gap-4 bg-NAVBAR_BACKGROUND px-4 lg:px-32'
        }>
        <span>
          <Link href="/">
            <Image
              source={IMAGES.logo}
              style={tailwind('aspect-video h-16 w-20 w-auto md:h-auto')}
            />
          </Link>
        </span>
        <ActionButton label={'Sign in'} onPress={() => router.push('/signin')} />
      </div>
      <Slot />
    </>
  );
};

export default Navbar;
