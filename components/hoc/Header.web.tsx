import React, { useEffect, useState } from 'react';
import { Href, Link, router, usePathname } from 'expo-router';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import { Image } from 'react-native';
import { IMAGES } from '@/utils/images';
import { useAuthStore } from '@/store/authStore';
import { ITabItem } from '@/utils/interfaces';
import { removeParenthesisString } from '@/utils/helper';
import { headerOptions } from '@/utils/appConstants';

const Header = () => {
  const activeClass = 'border-2 border-x-0 border-t-0 border-b-WORKOUT_PURPLE';
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname() as Href<string | object>;
  const [activeTab, setActiveTab] = useState<Href<string | object>>('/'); // Default active tab
  const [navItems] = useState<ITabItem[]>(headerOptions);

  const renderActionButtonAndLinks = () => {
    if (!isAuthenticated) {
      console.log('activeTab', activeTab);
      let isActive = activeTab === '/workout-sessions';
      return (
        <div className="flex flex-row items-center justify-between gap-12">
          <Link href={'/workout-sessions'} style={tailwind('text-white')}>
            <div
              className={`relative text-center  font-normal leading-[30px] tracking-[0] text-white [font-family:'Inter-Regular',Helvetica] ${isActive ? activeClass : ''}`}>
              {'Workout Session'}
            </div>
          </Link>
          <ActionButton label={'Sign in'} onPress={() => router.push('/signin')} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between gap-24">
        {navItems.map((item: ITabItem, index) => {
          let isActive =
            activeTab === removeParenthesisString(item.path).replace('//', '/') ||
            (item.key === 'workout' && '/workouts/public' === activeTab);

          return (
            <Link key={index} href={item.path} style={tailwind('text-white')}>
              <div
                className={`relative text-center  font-normal leading-[30px] tracking-[0] text-white [font-family:'Inter-Regular',Helvetica] ${
                  isActive ? activeClass : ''
                }`}>
                {item.value}
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);
  return (
    <>
      <div
        className={
          'fixed left-0 right-0 top-0 z-50 flex h-24 flex-row items-center justify-between gap-4 bg-NAVBAR_BACKGROUND px-4 lg:px-32'
        }>
        <span>
          <Link href="/(tabs)/(workout)/">
            <Image
              source={IMAGES.logo}
              style={tailwind('aspect-video h-16 w-20 w-auto md:h-auto')}
            />
          </Link>
        </span>
        {renderActionButtonAndLinks()}
      </div>
    </>
  );
};

export default Header;
