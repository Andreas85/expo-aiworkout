import { Platform } from 'react-native';
import React from 'react';
import CustomTopHeader from '../atoms/CustomTopHeader';
import CustomUploadImage from '../molecules/CustomUploadImage';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { ActionButton } from '../atoms/ActionButton';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import WrapperContainer from '../molecules/WrapperContainer';

const ProfileScreen = () => {
  const authStore = useAuthStore();
  const { isLargeScreen } = useWebBreakPoints();
  const handleLogout = () => {
    authStore.clearTokenFromStore();
    router.navigate('/');
  };
  return (
    <Container style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-28' : ''} `)}>
      <CustomTopHeader heading="Profile" />
      <Container
        style={Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'flex-col gap-4' : ' flex-row gap-24'} items-center justify-between `,
          ),
          native: tailwind('flex-col items-center justify-center gap-4'),
        })}>
        <Container style={tailwind(`${isLargeScreen ? '' : ' flex-1'}  `) as any}>
          <CustomUploadImage />
        </Container>
        <WrapperContainer
          wrapperContainerStyle={{
            web: `flex ${isLargeScreen ? 'w1-[21.4375rem] self-stretch' : 'flex-2 px-[2rem] py-[2.25rem]'}   flex-col items-start gap-[2.75rem]`,
            native: `flex w-[] flex-col items-start gap-4`,
          }}>
          <ActionButton
            uppercase={true}
            label={'Logout'}
            onPress={handleLogout}
            style={tailwind('rounded-lg')}
          />
          <ActionButton
            uppercase={true}
            label={'Logout'}
            onPress={handleLogout}
            style={tailwind('rounded-lg')}
          />
        </WrapperContainer>
      </Container>
    </Container>
  );
};

export default ProfileScreen;
