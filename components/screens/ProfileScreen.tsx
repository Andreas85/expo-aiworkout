import { Platform } from 'react-native';
import React from 'react';
import CustomTopHeader from '../atoms/CustomTopHeader';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import WrapperContainer from '../molecules/WrapperContainer';
import ShowLabelValue from '../atoms/ShowLabelValue';
import { TouchableOpacity } from 'react-native-gesture-handler';
import TextContainer from '../atoms/TextContainer';

const ProfileScreen = () => {
  const { clearTokenFromStore } = useAuthStore();
  const userData = useAuthStore(state => state.userData);
  const { isLargeScreen } = useWebBreakPoints();
  const handleLogout = () => {
    clearTokenFromStore();
    router.navigate('/');
  };

  const handleDeleteProfile = () => {
    console.log('Delete account');
  };
  return (
    <Container style={tailwind(`h-full w-full flex-1 px-4 ${!isLargeScreen ? 'my-4 px-28' : ''} `)}>
      <CustomTopHeader heading="Profile" />
      <Container
        style={Platform.select({
          web: tailwind(
            `${isLargeScreen ? 'flex-col gap-4' : ' flex-row gap-24'} items-center justify-between `,
          ),
          native: tailwind(' items-start justify-center gap-4'),
        })}>
        <WrapperContainer
          wrapperContainerStyle={{
            web: `flex ${isLargeScreen ? ' self-stretch px-4 py-4' : 'flex-2 px-[2rem] py-[2.25rem]'}   flex-col items-start gap-[2.75rem]`,
            native: `justify-start   gap-4 px-4 py-4`,
          }}>
          <ShowLabelValue
            label={'Firstname :'}
            value={userData?.firstName}
            container={{
              web: `  flex-1  items-start justify-center `,
              native: 'flex-none ',
            }}
            labelContainer={{
              web: `flex-1 `,
              native: '',
            }}
            valueContainer={{
              web: `flex-1 `,
              native: 'flex-1',
            }}
            noOfLinesValue={1}
          />
          <ShowLabelValue
            label={'Lastname :'}
            value={userData?.lastName}
            container={{
              web: `  flex-1  items-start justify-center `,
              native: ' flex-none ',
            }}
            labelContainer={{
              web: `flex-1 `,
              native: '',
            }}
            valueContainer={{
              web: `flex-1 `,
              native: ' ',
            }}
            noOfLinesValue={1}
          />
          <ShowLabelValue
            label={'Email :'}
            value={userData?.email}
            container={{
              web: `  flex-1  items-start justify-center `,
              native: 'flex-none ',
            }}
            labelContainer={{
              web: `flex-1 `,
              native: '',
            }}
            valueContainer={{
              web: `flex-1 `,
              native: ' ',
            }}
            noOfLinesValue={1}
          />
          <Container
            style={Platform.select({
              web: tailwind('mb-4 w-full border-[0.5px] border-white'),
              native: tailwind('mb-4 border-[0.5px] border-white '),
            })}
          />
          <TouchableOpacity onPress={handleLogout}>
            <TextContainer
              data={'Log Out'}
              style={Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} `,
                ),
              })}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeleteProfile}>
            <TextContainer
              data={'Delete Profile'}
              style={Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} `,
                ),
              })}
            />
          </TouchableOpacity>
        </WrapperContainer>
      </Container>
    </Container>
  );
};

export default ProfileScreen;
