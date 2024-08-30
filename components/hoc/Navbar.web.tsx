import React from 'react';
import { Link, router, Slot, usePathname } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import { Image, ScrollView } from 'react-native';
import { IMAGES } from '@/utils/images';
import { useAuthStore } from '@/store/authStore';
import { NAVBAR_TABS } from '@/utils/appConstants';

const Navbar = () => {
  const activeClass = 'border-2 border-x-0 border-t-0 border-b-WORKOUT_PURPLE';
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  // const segments = useSegments();

  const renderActionButtonAndLinks = () => {
    if (!isAuthenticated) {
      return <ActionButton label={'Sign in'} onPress={() => router.push('/signin')} />;
    }
    return (
      <div className="flex items-center justify-between gap-24">
        {NAVBAR_TABS.map((item, index) => {
          const isActiveRoute = item.path === pathname ? activeClass : '';
          return (
            <Link
              href={item.path}
              className={`relative text-center  font-normal leading-[30px] tracking-[0] text-white [font-family:'Inter-Regular',Helvetica] ${isActiveRoute}`}>
              {item.label}
            </Link>
          );
        })}
      </div>
    );
  };
  return (
    <>
      <div
        className={
          'fixed left-0 right-0 top-0 z-50 flex h-24 flex-row items-center justify-between gap-4 bg-NAVBAR_BACKGROUND px-4 lg:px-32'
        }>
        <span>
          <Link href="/">
            <Image
              source={IMAGES.logo}
              style={tailwind('aspect-video h-16 w-20 w-auto md:h-auto')}
            />
          </Link>
        </span>
        {renderActionButtonAndLinks()}
      </div>
      <ScrollView>
        <Slot />
      </ScrollView>
    </>
  );
};

export default Navbar;
