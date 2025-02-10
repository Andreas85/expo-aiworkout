import { Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { ActionButton } from '../atoms/ActionButton';
import { User } from '@/services/interfaces';
import { useMutation } from '@tanstack/react-query';
import { deleteProfileService, updateProfileService } from '@/services/me';

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
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const { isLargeScreen } = useWebBreakPoints();
  const [editedData, setEditedData] = useState<User | null>(userData);
  const [responseError, setResponseError] = useState<string>();

  const { mutate: mutateUpdateProfile, isPending: isPendingUpdateProfile } = useMutation({
    mutationFn: updateProfileService,
    onSuccess: (data, variables) => {
      // const { input } = variables.formData;
      console.log('datas-uccess', { variables });
      setResponseError('');
      setIsEditFormVisible(false);
    },
    onError: (error: string) => {
      setResponseError(error);
    },
  });

  const { mutate: mutateDeletProfile, isPending: isPendingDeleteProfile } = useMutation({
    mutationFn: deleteProfileService,
    onSuccess: () => {
      clearTokenFromStore();
      hideModalDeleteProfile();
      router.replace('/');
    },
    onError: (error: string) => {
      console.log('error', error);
    },
  });

  // Add this useEffect to sync with userData updates
  useEffect(() => {
    setEditedData(userData);
  }, [userData]);

  // Update handleChange to modify editedData
  function handleChange(name: string) {
    return (text: string) => {
      setEditedData((prev: any) => ({
        ...prev,
        [name]: text,
      }));
    };
  }
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

  const handleDeleteProfileClick = () => {
    mutateDeletProfile();
  };

  function handleEditProfile() {
    setIsEditFormVisible((prev: boolean) => !prev);
  }

  function renderUserDetailContainer() {
    return (
      <>
        <ShowLabelValue
          label={'First Name :'}
          value={editedData?.firstName}
          isEditable={isEditFormVisible}
          container={{
            web: `  flex-1  items-start justify-start `,
            native: 'flex-none ',
          }}
          onChangeText={handleChange('firstName')}
          labelContainer={{
            web: `'flex-1 `,
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
          value={editedData?.lastName}
          isEditable={isEditFormVisible}
          onChangeText={handleChange('lastName')}
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
          value={editedData?.email}
          isEditable={isEditFormVisible}
          onChangeText={handleChange('email')}
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
        {isEditFormVisible && (
          <>
            {responseError && (
              <TextContainer
                style={tailwind('text-3 text-center text-red-400')}
                className="text-center text-sm !text-red-400"
                data={responseError}
              />
            )}
            <Container style={tailwind('flex-row items-center justify-center gap-4')}>
              <ActionButton
                uppercase={true}
                label={'Cancel'}
                onPress={() => {
                  setIsEditFormVisible(false);
                  // setEditedData(userData)
                }}
                isOutline={true}
                style={tailwind('rounded-lg')}
              />
              <ActionButton
                uppercase={true}
                label={'Save Changes'}
                onPress={handleSubmit}
                isLoading={isPendingUpdateProfile}
                disabled={isPendingUpdateProfile}
                style={tailwind('min-w-[8rem] rounded-lg')}
              />
            </Container>
          </>
        )}
      </>
    );
  }

  function handleSubmit() {
    if (editedData) {
      const { firstName, lastName, email } = editedData;
      mutateUpdateProfile({
        firstName,
        lastName,
        email,
      });
    }
  }

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
            web: ` ${isLargeScreen ? ' self-stretch px-4 pb-4 pt-4 gap-6' : 'flex-2 px-[2rem] py-[2.25rem] gap-[2.75rem]'}   flex-col items-start `,
            native: `justify-start   gap-4 px-4 py-4  w-full`,
          }}>
          <Container
            style={Platform.select({
              web: tailwind('flex w-full justify-end'),
              native: tailwind('w-full justify-end'),
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
              onPress={handleEditProfile}
              containerStyle={[
                Platform.select({
                  web: tailwind('flex-1 justify-end self-end'),
                  native: tailwind('self-end'),
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

          {renderUserDetailContainer()}
          {!isEditFormVisible && (
            <>
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
                      `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} text-WORKOUT_PURPLE `,
                    ),
                  })}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDeleteProfile}>
                <TextContainer
                  data={'Delete Profile'}
                  style={Platform.select({
                    web: tailwind(
                      `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1.25rem]  not-italic '} text-red-400`,
                    ),
                  })}
                />
              </TouchableOpacity>
            </>
          )}
        </WrapperContainer>
      </Container>
      <ConfirmationModal
        isModalVisible={openModalDeleteProfile}
        handleAction={handleDeleteProfileClick}
        closeModal={hideModalDeleteProfile}
        labelAction="Delete"
        isLoading={isPendingDeleteProfile}
        disabledAction={isPendingDeleteProfile}
        message={
          'Deleting your profile is permanent and cannot be undone. Are you sure you want to proceed?'
        }
        isDeleteAction={true}
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
