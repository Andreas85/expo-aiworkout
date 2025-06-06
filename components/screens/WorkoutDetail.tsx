import React, { useEffect, useState } from 'react';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';

import { Platform, TouchableOpacity } from 'react-native';
import { tailwind } from '@/utils/tailwind';
import { ActionButton } from '../atoms/ActionButton';
import { SkypeIndicator } from 'react-native-indicators';

import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import BackActionButton from '../atoms/BackActionButton';
import LabelContainer from '../atoms/LabelContainer';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import useModal from '@/hooks/useModal';
import AddAndEditWorkoutModal from '../modals/AddAndEditWorkoutModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWorkoutCopy,
  deleteWorkoutDetail,
  updateWorkoutDataRequest,
} from '@/services/workouts';
import ConfirmationModal from '../modals/ConfirmationModal';
import { useToast } from 'react-native-toast-notifications';

import AddExercise from '../modals/AddExercise';
import { useAuthStore } from '@/store/authStore';
import useWorkoutNonLoggedInUser from '@/hooks/useWorkoutNonLoggedInUser';
import RenderWorkoutDetailController from '../atoms/RenderWorkoutDetailController';
import RenderWorkoutDetailExercises from '../atoms/RenderWorkoutDetailExercises';
import RenderWorkoutDetailStartWorkoutContainer from '../atoms/RenderWorkoutDetailStartWorkoutContainer';
import EditGenerateWorkout from '../modals/EditGenerateWorkout';
import { useGenerateWorkoutPlanStore } from '@/store/generateWorkoutPlanStore';
import Colors from '@/constants/Colors';
import { Workout } from '@/services/interfaces';
import { WorkoutPlan } from '@/types';
import WorkoutOptionsMenu from './WorkoutOptionsMenu';
import ImageGenerationModal from '../atoms/ImageGenerationModal';
import AIImageButton from '../atoms/AIImageButton';
import StarsIcon from '../atoms/AiStarsIcon';

const WorkoutDetail = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { slug } = useLocalSearchParams() as any;
  const { setGeneratedWorkoutPlan } = useGenerateWorkoutPlanStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { handleDeleteWorkoutForNonLoggedInUser, handleDuplicateWorkoutForNonLoggedInUser } =
    useWorkoutNonLoggedInUser();
  const { hideModal, showModal, openModal } = useModal();
  const {
    hideModal: hideModalMenu,
    showModal: showModalMenu,
    openModal: openModalMenu,
  } = useModal();
  const {
    hideModal: hideModalUpdateImage,
    showModal: showModalUpdateImage,
    openModal: openModalUpdateImage,
  } = useModal();
  const {
    hideModal: hideEditGeneratedWorkoutModal,
    openModal: openEditGeneratedWorkoutModal,
    showModal: showEditGeneratedWorkoutModal,
  } = useModal();
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

  const { setWorkoutDetail } = useWorkoutDetailStore();
  const [isCurrentWorkoutPublic, setIsCurrentWorkoutPublic] = useState<boolean>(false);
  const { isLargeScreen, isExtraSmallScreenOnly } = useWebBreakPoints();
  const [isPendingExerciseCardAction, setIsPendingExerciseCardAction] = useState<boolean>(false);

  const toggleIsCurrentWorkoutPublic = () => {
    mutateUpdatedWorkout({
      formData: { isPublic: !isCurrentWorkoutPublic },
      queryParams: { id: slug },
    });
  };

  const { mutate: mutateUpdatedWorkout, isPending } = useMutation({
    mutationFn: updateWorkoutDataRequest,
    onSuccess: async data => {
      await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
      });
      await queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      setWorkoutDetail(data?.data);
      setIsCurrentWorkoutPublic(data?.data?.isPublic);
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
    if (isAuthenticated) {
      mutateCreateWorkoutCopy({ id: slug });
      return;
    }
    handleDuplicateWorkoutForNonLoggedInUser({
      name: workoutDetail?.name ?? '',
    });
    hideModalCreateWorkoutCopy();
  };

  const handleDeleteWorkout = () => {
    if (isAuthenticated) {
      mutateDeleteWorkout({ id: slug });
      return;
    }
    handleDeleteWorkoutForNonLoggedInUser();
  };

  useEffect(() => {
    if (workoutDetail) {
      setIsCurrentWorkoutPublic(workoutDetail?.isPublic);
      navigation.setOptions({ title: `Workout: ${workoutDetail.name ?? ''}`, unmountOnBlur: true });
    }
  }, [workoutDetail]);

  const handleEditGeneratedWorkoutClick = () => {
    if (workoutDetail) {
      setGeneratedWorkoutPlan(workoutDetail as unknown as WorkoutPlan);
      showEditGeneratedWorkoutModal();
    }
  };
  const renderExcerciseLabel = () => {
    return (
      <>
        <Container
          style={[tailwind(`mb-2 flex-row flex-wrap items-center justify-between gap-2  `)]}>
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
            <Container style={[tailwind(`relative self-center `)]}>
              <LabelContainer
                label={'Saving Changes'}
                labelStyle={Platform.select({
                  web: tailwind(`${isExtraSmallScreenOnly ? 'text-[10px]' : '' + ''}`),
                  native: tailwind('z-20 '),
                })}
                containerStyle={[
                  Platform.select({
                    web: tailwind(`
                    ${'flex-1 justify-end gap-2 text-[6px]'} 
                  `),
                    native: tailwind(
                      ' bottom-0 left-0 right-0 top-0  flex-1 items-center justify-center gap-2 self-center ',
                    ),
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
          <Container
            style={[
              tailwind(
                `relative ${isExtraSmallScreenOnly ? '' : 'w-auto'} flex-row flex-wrap items-center gap-2 self-center`,
              ),
            ]}>
            {!isLargeScreen && (
              <>
                <AIImageButton />
                <ActionButton
                  label={'Regenerate Workout'}
                  onPress={handleEditGeneratedWorkoutClick}
                  style={[
                    Platform.select({
                      web: tailwind('rounded-xl px-3'),
                      native: tailwind('rounded-xl px-3'),
                    }),
                  ]}
                  left={<StarsIcon brandColor={Colors.white} />}
                />
              </>
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
            {isLargeScreen && (
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderRadius: 8,
                  marginLeft: 8,
                }}
                onPress={showModalMenu}>
                <FontAwesome5 name="ellipsis-v" size={24} color={Colors.brandColor} />
              </TouchableOpacity>
            )}
          </Container>
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
            />
          </Container>
        </Container>

        <RenderWorkoutDetailController
          showModal={showModal}
          isCurrentWorkoutPublic={isCurrentWorkoutPublic}
          toggleIsCurrentWorkoutPublic={toggleIsCurrentWorkoutPublic}
          showModalCreateWorkoutCopy={showModalCreateWorkoutCopy}
          showModalDeleteModal={showModalDeleteModal}
        />

        {renderExcerciseLabel()}
        <Container
          style={[
            Platform.select({
              web: tailwind(`
                web:h-[100%] web:pb-[210px] mx-auto h-full w-full 
            `),
              native: tailwind('flex-1'),
            }),
          ]}>
          <Container
            style={[
              Platform.select({
                web: tailwind(` ${isLargeScreen ? '' : ''}  web:h-[96%] `),
                native: tailwind('mb-1 flex-1 '),
              }),
            ]}>
            <RenderWorkoutDetailExercises
              setIsPendingExerciseCardAction={() => setIsPendingExerciseCardAction}
            />
          </Container>
        </Container>
      </Container>
      <RenderWorkoutDetailStartWorkoutContainer />
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
      {openEditGeneratedWorkoutModal && (
        <EditGenerateWorkout
          isVisible={openEditGeneratedWorkoutModal}
          toggleModal={hideEditGeneratedWorkoutModal}
          workoutDetail={workoutDetail as Workout}
        />
      )}
      {openModalMenu && (
        <WorkoutOptionsMenu
          visible={openModalMenu}
          onClose={hideModalMenu}
          handleEditGeneratedWorkoutClick={handleEditGeneratedWorkoutClick}
          showEditWorkout={showModal}
          showModalUpdateImage={showModalUpdateImage}
        />
      )}
      {openModalUpdateImage && (
        <ImageGenerationModal
          isVisible={openModalUpdateImage}
          onClose={hideModalUpdateImage}
          workoutName={workoutDetail?.name || ''}
        />
      )}
    </Container>
  );
};

export default WorkoutDetail;
