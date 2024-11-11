import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import { Platform } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import { SkypeIndicator } from 'react-native-indicators';
import CustomSwitch from '../atoms/CustomSwitch';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import NoDataSvg from '../svgs/NoDataSvg';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import { AntDesign, Feather, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ICON_SIZE, REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import DraggableExercises from '../molecules/DraggableExercises';
import useModal from '@/hooks/useModal';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import { useMutation } from '@tanstack/react-query';
import {
  createWorkoutCopy,
  deleteWorkoutDetail,
  updateWorkoutDataRequest,
} from '@/services/workouts';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useToast } from 'react-native-toast-notifications';
import { queryClient } from '@/utils/helper';
import AddExercise from '../modals/AddExercise';

const WorkoutDetail = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const { slug } = useLocalSearchParams() as any;
  const { hideModal, showModal, openModal } = useModal();
  const {
    hideModal: hideModalAddExercise,
    openModal: openModalAddExercise,
    showModal: showModalAddExercise,
  } = useModal();
  const {
    hideModal: hideModalDeleteWorkout,
    showModal: showModalDeleteModal,
    openModal: openModalDeleteModal,
  } = useModal();
  const {
    hideModal: hideModalCreateWorkoutCopy,
    showModal: showModalCreateWorkoutCopy,
    openModal: openModalCreateWorkoutCopy,
  } = useModal();
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const hasExercise = useWorkoutDetailStore(state => state.hasExercise);
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const [isCurrentWorkoutPublic, setIsCurrentWorkoutPublic] = useState<boolean>(
    workoutDetail?.isPublic ?? false,
  );
  const { isLargeScreen, isExtraSmallScreenOnly } = useWebBreakPoints();
  const [isPendingExerciseCardAction, setIsPendingExerciseCardAction] = useState<boolean>(false);

  const toggleIsCurrentWorkoutPublic = () => {
    mutateUpdatedWorkout({
      formData: { isPublic: !isCurrentWorkoutPublic },
      queryParams: { id: slug },
    });
    setIsCurrentWorkoutPublic(!isCurrentWorkoutPublic);
  };

  const { mutate: mutateUpdatedWorkout, isPending } = useMutation({
    mutationFn: updateWorkoutDataRequest,
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
        type: 'all',
        refetchType: 'all',
        stale: true,
      });
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug] });
      setWorkoutDetail(data?.data);
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
  });

  const { mutate: mutateDeleteWorkout, isPending: isPendingDeleteWorkout } = useMutation({
    mutationFn: deleteWorkoutDetail,
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
        type: 'all',
        refetchType: 'all',
        stale: true,
      });

      hideModalDeleteWorkout();
      router.push('/workouts');
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
  });

  const { mutate: mutateCreateWorkoutCopy, isPending: isPendingCreateWorkoutCopy } = useMutation({
    mutationFn: createWorkoutCopy,
    onSuccess: async data => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
        type: 'all',
        refetchType: 'none',
      });
      toast.show('Duplicate success', { type: 'success' });
      router.push(`/workout/${data?.data?._id}`);
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      hideModalCreateWorkoutCopy();
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
          <NoDataSvg label="No exercises" message={'Start building your workout'} />
        </Container>
      );
    }
    return (
      <>
        <DraggableExercises setIsPendingExerciseCardAction={setIsPendingExerciseCardAction} />
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
                'absolute bottom-3 left-0 right-0 mx-auto items-center justify-center self-center px-4',
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
        <Container
          style={[
            Platform.select({
              web: tailwind(` gap-4 ${isLargeScreen ? 'hidden ' : 'flex-row'} flex-1.5`),
              native: tailwind('hidden'),
            }),
          ]}>
          <BackActionButton />
          <LabelContainer
            label={workoutDetail?.name ?? ''}
            labelStyle={[
              Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'}   font-bold not-italic leading-[150%] text-white `,
                ),
                native: tailwind('text-xl font-bold'),
              }),
            ]}
            containerStyle={[
              Platform.select({
                web: tailwind(`
                ${isLargeScreen ? 'hidden' : 'flex-1 justify-start text-xl font-bold'}  
              `),
                native: tailwind('hidden'),
              }),
            ]}
            onPress={showModal}
            left={<FontAwesome5 name="edit" color="#A27DE1" size={ICON_SIZE} />}
          />
        </Container>
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
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'} text-center  font-normal not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-sm font-bold'),
            }),
          ]}
          onPress={showModalCreateWorkoutCopy}
          containerStyle={[
            Platform.select({
              web: tailwind('flex-1 justify-end'),
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
                ` ${isLargeScreen ? 'text-[0.8125rem]' : 'text-xl'}  text-center font-normal  not-italic leading-[150%] text-white`,
              ),
              native: tailwind('text-sm font-bold'),
            }),
          ]}
          containerStyle={[
            Platform.select({
              web: tailwind('flex-1 justify-end'),
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
        <Container style={[tailwind('mb-2  flex-row items-center justify-between gap-2 ')]}>
          <Container style={[tailwind(``)]}>
            <TextContainer
              data={`Exercises `}
              style={Platform.select({
                web: tailwind(
                  `${isLargeScreen ? 'text-base' : 'text-2xl'}  font-bold capitalize not-italic leading-[150%] text-white`,
                ),
                native: tailwind(' self-left  text-lg font-bold'),
              })}
            />
          </Container>
          {(isPending || isPendingExerciseCardAction) && (
            <Container style={[tailwind(``)]}>
              <LabelContainer
                label={'Saving Changes'}
                labelStyle={Platform.select({
                  web: tailwind(isExtraSmallScreenOnly ? 'text-[10px]' : ''),
                })}
                containerStyle={[
                  Platform.select({
                    web: tailwind(`
                    ${'flex-1 justify-end gap-2 text-[6px]'} 
                  `),
                    native: tailwind('flex-1 justify-end gap-2'),
                  }),
                ]}
                right={
                  <SkypeIndicator
                    color="#A27DE1"
                    animating
                    size={Platform.OS === 'web' ? 10 : 16}
                    style={{
                      marginRight: 4,
                    }}
                  />
                }
              />
            </Container>
          )}
          <ActionButton
            label={'Add Exercise'}
            onPress={showModalAddExercise}
            style={[
              Platform.select({
                web: tailwind('rounded-xl px-3'),
                native: tailwind('rounded-xl px-3'),
              }),
            ]}
            left={<AntDesign name="pluscircleo" size={20} color="white" />}
          />
        </Container>
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
            web: tailwind(`mx-auto flex w-full flex-1 flex-col gap-2 px-32
                ${isLargeScreen && 'px-4'}
              `),
            native: tailwind('flex-1 flex-col  p-4'),
          }),
        ]}>
        <Container
          style={[
            Platform.select({
              web: tailwind(` pt-4`),
              native: tailwind('space-y-4'),
            }),
            tailwind('flex-row items-center justify-between'),
          ]}>
          <Container style={[tailwind('relative flex-1 flex-row items-center gap-2 ')]}>
            {isLargeScreen && (
              <Container style={[]}>
                <BackActionButton />
              </Container>
            )}
            {/* {(isPending || isPendingExerciseCardAction) &&
              Platform.OS === 'web' &&
              !isLargeScreen && (
                <Container
                  style={[tailwind(` relative flex-1 items-start justify-center self-center`)]}>
                  <LabelContainer
                    label={'Saving Changes'}
                    containerStyle={[
                      Platform.select({
                        web: tailwind(`
                    ${isLargeScreen ? 'hidden' : 'absolute top-[5px] self-center'}
                  `),
                      }),
                    ]}
                    right={
                      <SkypeIndicator
                        color="#A27DE1"
                        animating
                        size={Platform.OS === 'web' ? 20 : 16}
                        style={{
                          marginRight: 10,
                        }}
                      />
                    }
                  />
                </Container>
              )} */}
            <LabelContainer
              label={workoutDetail?.name ?? ''}
              labelStyle={[
                Platform.select({
                  web: tailwind(
                    `${isLargeScreen ? 'text-[1.0625rem]' : 'text-[1.5rem]'} text-center  font-bold not-italic leading-[150%] text-white`,
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
              native: tailwind('flex-1'),
            }),
          ]}>
          <Container
            style={[
              Platform.select({
                web: tailwind(`flex-1 ${isLargeScreen ? '' : 'pb-8'}`),
                native: tailwind('mb-1 flex-1 '),
              }),
            ]}>
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
      {openModalCreateWorkoutCopy && (
        <ConfirmationModal
          isModalVisible={openModalCreateWorkoutCopy}
          closeModal={hideModalCreateWorkoutCopy}
          message="Are you sure you want to duplicate this workout?"
          labelAction="Duplicate"
          isLoading={isPendingCreateWorkoutCopy}
          handleAction={handleDuplicateWorkout}
        />
      )}
      {openModalAddExercise && (
        <AddExercise isModalVisible={openModalAddExercise} closeModal={hideModalAddExercise} />
      )}
    </Container>
  );
};

export default WorkoutDetail;
