import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';

import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ICON_SIZE, REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import DraggableExercises from '../molecules/DraggableExercises';
import AppTextSingleInput from '../atoms/AppTextSingleInput';
import useModal from '@/hooks/useModal';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWorkoutCopy,
  deleteWorkoutDetail,
  updateWorkoutDataRequest,
} from '@/services/workouts';
import ConfirmationModal from '../modals/ConfirmationModal';

const WorkoutDetail = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams() as any;
  const { hideModal, showModal, openModal } = useModal();
  const {
    hideModal: hideModalDeleteWorkout,
    showModal: showModalDeleteModal,
    openModal: openModalDeleteModal,
  } = useModal();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const [isCurrentWorkoutPublic, setIsCurrentWorkoutPublic] = useState<boolean>(false);
  const { isLargeScreen, isMobileDeviceOnly } = useWebBreakPoints();

  const toggleIsCurrentWorkoutPublic = () => {
    mutateUpdatedWorkout({
      formData: { isPublic: !isCurrentWorkoutPublic },
      queryParams: { id: slug },
    });
    setIsCurrentWorkoutPublic(!isCurrentWorkoutPublic);
  };

  const { mutate: mutateUpdatedWorkout } = useMutation({
    mutationFn: updateWorkoutDataRequest,
    onSuccess: async data => {
      return await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
      });
    },
  });

  const { mutate: mutateDeleteWorkout, isPending: isPendingDeleteWorkout } = useMutation({
    mutationFn: deleteWorkoutDetail,
    onSuccess: async data => {
      // console.log(data, 'data');
      hideModalDeleteWorkout();
      router.push('/workouts');
      return await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
    },
    onError: error => {
      console.log(error, 'error');
    },
  });

  const { mutate: mutateCreateWorkoutCopy } = useMutation({
    mutationFn: createWorkoutCopy,
    onSuccess: async data => {
      router.push(`/workout/${data?.data?._id}`);
      return await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS],
      });
    },
  });

  const handleDuplicateWorkout = () => {
    mutateCreateWorkoutCopy({ id: slug });
  };

  const handleDeleteWorkout = () => {
    mutateDeleteWorkout({ id: slug });
  };

  useEffect(() => {
    if (workoutDetail) {
      setIsCurrentWorkoutPublic(workoutDetail?.isPublic);
      navigation.setOptions({ title: `Workout: ${workoutDetail.name ?? ''}`, unmountOnBlur: true });
    }
  }, [workoutDetail]);

  const renderWorkoutExercises = () => {
    if (!hasExercise) {
      return (
        <Container style={tailwind('flex-1')}>
          <NoDataSvg label="No exercises (Coming Soon)" message={'Start building your workout'} />
        </Container>
      );
    }
    return (
      <>
        <DraggableExercises />
      </>
    );
  };

  const renderStartWorkoutButton = () => {
    if (hasExercise) {
      return (
        <Container
          style={[
            Platform.select({
              web: tailwind(
                'absolute bottom-3 left-0 right-0 mx-auto flex-1  items-center justify-center self-center px-4',
              ),

              native: tailwind(
                'absolute bottom-0 left-0 right-0  flex-1 bg-NAVBAR_BACKGROUND p-4 ',
              ),
            }),
          ]}>
          <ActionButton
            label="Start workout"
            uppercase
            disabled
            style={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'w-full' : 'h-[3.6875rem] w-[23.0625rem]'} flex  shrink-0 items-center justify-center gap-2.5 rounded-lg px-2.5 py-3`,
                ),
                native: tailwind('rounded-lg '),
              }),
            ]}
          />
        </Container>
      );
    }
  };

  const renderWorkoutController = () => {
    return (
      <Container
        style={[
          Platform.select({
            web: tailwind('w-full flex-row flex-wrap items-center justify-between gap-4 '),
            native: tailwind('w-full flex-row flex-wrap  items-center justify-between gap-1 '),
          }),
        ]}>
        <LabelContainer
          label={workoutDetail?.name ?? ''}
          labelStyle={[
            Platform.select({
              web: tailwind(
                `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} text-center font-bold  not-italic leading-[150%] text-white `,
              ),
              native: tailwind('text-xl font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(`
                ${isLargeScreen ? 'hidden' : 'text-xl font-bold'}  
              `),
              native: tailwind('hidden'),
            }),
          ]}
          onPress={showModal}
          left={<FontAwesome5 name="edit" color="#A27DE1" size={ICON_SIZE} />}
        />
        <CustomSwitch
          isEnabled={isCurrentWorkoutPublic}
          toggleSwitch={toggleIsCurrentWorkoutPublic}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ' text-center text-xl font-normal not-italic leading-[150%] text-white',
              ),
              native: tailwind('text-sm font-bold'),
            }),
          ]}
          label="Public"
        />
        <LabelContainer
          label={'Duplicate'}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center font-normal  not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-sm font-bold'),
            }),
          ]}
          onPress={handleDuplicateWorkout}
          containerStyle={[
            Platform.select({
              web: tailwind(''),
              // native: tailwind('flex-1'),
            }),
          ]}
          left={
            <Ionicons
              name="duplicate-sharp"
              color="#A27DE1"
              size={Platform.OS === 'web' ? ICON_SIZE : 16}
            />
          }
        />
        <LabelContainer
          label={'Delete'}
          labelStyle={[
            Platform.select({
              web: tailwind(
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center font-normal  not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-sm font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind(''),
              // native: tailwind('flex-1'),
            }),
          ]}
          onPress={showModalDeleteModal}
          left={
            <FontAwesome6
              name="trash-can"
              color="#A27DE1"
              size={Platform.OS === 'web' ? ICON_SIZE : 16}
            />
          }
        />
      </Container>
    );
  };

  const renderExcerciseLabel = () => {
    return (
      <>
        <TextContainer
          data={`Exercises`}
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? 'text-base' : 'text-2xl'}  font-bold capitalize not-italic leading-[150%] text-white`,
            ),
            native: tailwind(' self-left  text-lg font-bold'),
          })}
        />
        <Container
          style={[
            Platform.select({
              web: tailwind(`mb-4 border-[0.35px] border-white`),
              native: tailwind(`my-4 border-[0.35px] border-white`),
            }),
          ]}
        />
      </>
    );
  };

  return (
    <Container style={[tailwind(`flex-1  bg-transparent`)]}>
      <Container
        style={[
          Platform.select({
            web: tailwind(`mx-auto flex w-full flex-col gap-2 px-32
                ${isLargeScreen && 'px-4'}
              `),
            native: tailwind('flex flex-col  p-4'),
          }),
          tailwind('flex-1'),
        ]}>
        <Container
          style={[
            Platform.select({
              web: tailwind(` pt-4`),
              native: tailwind('space-y-4'),
            }),
            tailwind('flex-row items-center justify-between'),
          ]}>
          <Container style={[tailwind('flex-1 flex-row items-center justify-between gap-2')]}>
            <Container>
              <BackActionButton />
            </Container>
            <LabelContainer
              label={workoutDetail?.name ?? ''}
              labelStyle={[
                Platform.select({
                  web: tailwind(
                    `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} text-center font-bold  not-italic leading-[150%] text-white `,
                  ),
                  native: tailwind('flex-1 text-xl font-bold'),
                }),
              ]}
              containerStyle={[
                Platform.select({
                  web: tailwind(`
                    ${isLargeScreen ? 'flex-1 justify-between' : 'hidden'}  
                  `),
                  native: tailwind('flex-1 justify-between'),
                }),
              ]}
              onPress={showModal}
              left={<Feather name="edit" color="#A27DE1" size={ICON_SIZE} />}
            />
          </Container>
        </Container>

        {renderWorkoutController()}

        {renderExcerciseLabel()}
        <Container
          style={[
            Platform.select({
              web: tailwind(`
                mx-auto w-full
            `),
            }),
            tailwind('flex-1'),
          ]}>
          <Container
            style={[
              Platform.select({
                web: tailwind('mb-16'),
                native: tailwind('mb-10 '),
              }),
              tailwind('flex-1 pb-8'),
            ]}>
            <Container
              style={[
                Platform.select({
                  web: tailwind(
                    `mx-auto flex w-[44.875rem] flex-col items-start gap-2 ${isLargeScreen && 'w-full'}`,
                  ),
                  native: tailwind(`mx-auto w-full items-start gap-2 `),
                }),
              ]}>
              <AppTextSingleInput
                initialValues={{ exercise: '' }}
                placeholder="Search exercise name"
                fieldName={''}
                handleSubmit={() => {}}
                containerStyleAppTextInput={[
                  Platform.select({
                    web: tailwind(
                      `w-full border border-white  ${isMobileDeviceOnly ? 'bg-[#42382E]' : 'bg-[#41474A]'} px-5`,
                    ),
                    native: tailwind(`w-full border  border-white  bg-[#42382E]  px-5`),
                  }),
                ]}
                testInputStyle={[
                  Platform.select({
                    web: tailwind(' py-4 text-left text-base font-normal'),
                    // native: tailwind('h-20 flex-1 py-4 text-left text-base font-normal'),
                  }),
                ]}
                autoCapitalize="none"
                placeholderTextColor="#fff"
                right={<Ionicons name="search" color="#fff" size={ICON_SIZE} />}
              />
            </Container>
            {renderWorkoutExercises()}
          </Container>
        </Container>
      </Container>
      {renderStartWorkoutButton()}
      {openModal && (
        <AddAndEditWorkoutModal
          isEditWorkout={true}
          isModalVisible={openModal}
          closeModal={hideModal}
        />
      )}
      {openModalDeleteModal && (
        <ConfirmationModal
          isModalVisible={openModalDeleteModal}
          closeModal={hideModalDeleteWorkout}
          message="Are you sure you want to delete this workout?"
          labelAction="Delete"
          isLoading={isPendingDeleteWorkout}
          handleAction={handleDeleteWorkout}
        />
      )}
    </Container>
  );
};

export default WorkoutDetail;
