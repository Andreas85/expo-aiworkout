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
import LabelContainer from '../atoms/LabelContainer';
import { FontAwesome5 } from '@expo/vector-icons';
import { ICON_SIZE } from '@/utils/appConstants';
import ConfirmationModal from '../modals/ConfirmationModal';
import useModal from '@/hooks/useModal';

const ProfileScreen = () => {
  const { clearTokenFromStore } = useAuthStore();
  const {
    openModal: openModalLogout,
    showModal: showModalLogout,
    hideModal: hideModalLogout,
  } = useModal();
  const {
    openModal: openModalDeleteProfile,
    showModal: showModalDeleteProfile,
    hideModal: hideModalDeleteProfile,
  } = useModal();

  const userData = useAuthStore(state => state.userData);
  const { isLargeScreen } = useWebBreakPoints();

  const handleLogout = () => {
    clearTokenFromStore();
    router.navigate('/');
  };

  const handleLogoutClick = () => {
    showModalLogout();
  };

  const handleDeleteProfile = () => {
    showModalDeleteProfile();
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
            web: `flex ${isLargeScreen ? ' self-stretch px-4 pb-4 pt-4 gap-6' : 'flex-2 px-[2rem] py-[2.25rem] gap-[2.75rem]'}   flex-col items-start `,
            native: `justify-start   gap-4 px-4 py-4`,
          }}>
          <Container
            style={Platform.select({
              web: tailwind('absolute right-4 top-4'),
              native: tailwind('absolute right-4 top-4'),
            })}>
            <LabelContainer
              label={'Edit'}
              labelStyle={[
                Platform.select({
                  web: tailwind(
                    ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center  font-normal not-italic leading-[150%] text-white`,
                  ),
                  native: tailwind('text-sm font-bold'),
                }),
              ]}
              onPress={() => {}}
              containerStyle={[
                Platform.select({
                  web: tailwind('flex-1 justify-end'),
                  // native: tailwind('flex-1'),
                }),
              ]}
              left={
                <FontAwesome5
                  name="edit"
                  color="#A27DE1"
                  size={isLargeScreen ? ICON_SIZE - 4 : ICON_SIZE}
                />
              }
            />
          </Container>
          <ShowLabelValue
            label={'First Name :'}
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
              web: `flex-2 `,
              native: 'flex-2',
            }}
            noOfLinesValue={1}
          />
          <ShowLabelValue
            label={'Last Name :'}
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
              web: `flex-2 `,
              native: 'flex-2 ',
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
              web: `flex-2 `,
              native: ' flex-2',
            }}
            noOfLinesValue={2}
          />
          <Container
            style={Platform.select({
              web: tailwind('mb-4 w-full border-[0.5px] border-white'),
              native: tailwind('mb-4 border-[0.5px] border-white '),
            })}
          />
          <TouchableOpacity onPress={handleLogoutClick}>
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
      <ConfirmationModal
        isModalVisible={openModalDeleteProfile}
        handleAction={() => {}}
        closeModal={hideModalDeleteProfile}
        labelAction="Delete"
        disabledAction={true}
        message={'Are you sure you want to delete your profile?'}
      />
      <ConfirmationModal
        isModalVisible={openModalLogout}
        handleAction={handleLogout}
        closeModal={hideModalLogout}
        message={'Are you sure you want to Log Out?'}
        labelAction={'Log Out'}
      />
    </Container>
  );
};

export default ProfileScreen;
