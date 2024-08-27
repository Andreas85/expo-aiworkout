import React from 'react';
import { Link, router, Slot } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { Text, View } from '../Themed';
import { ActionButton } from '../atoms/ActionButton';
import { Image } from 'react-native';
import { IMAGES } from '@/utils/images';

const Navbar = () => {
  return (
    <>
      <View style={{ flex: 1 }}>
        <View
          style={tailwind(
            'flex h-24 flex-row items-center justify-between gap-4 bg-NAVBAR_BACKGROUND px-24',
          )}>
          <Text>
            <Link href="/">
              <Image
                source={IMAGES.logo}
                style={tailwind('aspect-video h-16 w-20 w-auto md:h-auto')}
              />
            </Link>
          </Text>
          <ActionButton label={'Sign in'} onPress={() => router.push('/signin')} />
        </View>
        <Slot />
      </View>
    </>
  );
};

export default Navbar;
