import { Platform, StyleSheet, View, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import Container from '../atoms/Container';
import { Formik } from 'formik';
import { useAuthStore } from '@/store/authStore';
import {
  editExerciseInWorkout,
  editWorkoutExerciseProperty,
  updateExercisePropertyOfWorkout,
} from '@/utils/workoutStorageOperationHelper';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { updateExerciseProperty } from '@/utils/workoutSessionHelper';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { ExerciseElement } from '@/services/interfaces';
import { debouncedMutate, updateExerciseDataInWorkoutSession } from '@/utils/helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExerciseNotesOfWorkoutRequest } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { ActionButton } from '../atoms/ActionButton';
import useWorkoutNonLoggedInUser from '@/hooks/useWorkoutNonLoggedInUser';

interface IExerciseNotesModal {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
  item: ExerciseElement;
}

const ExerciseNotesModal = (props: IExerciseNotesModal) => {
  const { isVisible, toggleModal, item } = props;
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { updateExercisePropertyZustand } = useWorkoutSessionStore();
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const isWorkoutSessionDetailScreen = useWorkoutSessionStore(
    state => state.isWorkoutSessionDetailScreen,
  );
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [notes, setNotes] = useState<string>('');

  const { mutate: mutateUpdateExerciseToWorkoutRequest, isPending } = useMutation({
    mutationFn: updateExerciseNotesOfWorkoutRequest,
    onSuccess: async data => {
      if (isWorkoutSessionDetailScreen) {
        const result = updateExerciseDataInWorkoutSession(
          data?.data?.exercises,
          item?.exerciseId ?? '',
        );
        updateExercisePropertyZustand(item.order, 'notes', result?.notes);
      } else {
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
        });
      }
      updateWorkoutExercises(data?.data?.exercises);
      toggleModal();
    },
    onError: (error: any) => {
      console.log('error', error);
      // toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      console.log('onSettled');
    },
  });

  const handleAddNotes = async () => {
    const pathSegements = pathname.split('/');
    console.log('Add Notes', {
      notes,
    });
    if (isAuthenticated) {
      // Modify 'reps' based on 'isEnabled'
      let payload = {
        formData: {
          index: item?.order,
          notes,
        },
        queryParams: { id: workoutSessionDetails?.workoutId },
      };
      if (pathSegements?.[1] === 'workout-session') {
        console.log('Api call', payload);
        payload.queryParams = { id: workoutSessionDetails?.workoutId };
      } else if (pathSegements?.[1] === 'workout') {
        payload.queryParams = { id: slug };
      }
      // console.log('Api call', payload);
      debouncedMutate(mutateUpdateExerciseToWorkoutRequest, payload);
    } else {
      if (pathSegements?.[1] === 'workout-session') {
        await updateExerciseProperty(slug ?? '', item?._id ?? '', 'notes', notes);
        updateExercisePropertyOfWorkout(
          workoutSessionDetails?.workoutId ?? '',
          item?._id,
          'notes',
          notes,
        );
      } else if (pathSegements?.[1] === 'workout') {
        editWorkoutExerciseProperty(slug, item?._id, 'notes', notes);
      }

      toggleModal();
    }
    updateExercisePropertyZustand(item.order, 'notes', notes);
  };

  const handleCloseModal = () => {
    toggleModal();
  };

  useEffect(() => {
    if (item?.notes) {
      setNotes(item?.notes);
    }
  }, [item]);

  return (
    <>
      <ModalWrapper
        isModalVisible={isVisible}
        isCrossIconVisible={true}
        headerTitle={'Notes'}
        closeModal={handleCloseModal}>
        <Container>
          <Formik
            initialValues={{
              notes: item.notes ?? '',
            }}
            validateOnChange={false} // Disable validation on field change
            validateOnBlur={true} // Enable validation on blur
            enableReinitialize={true}
            onSubmit={handleAddNotes}>
            {({ handleSubmit }: any) => (
              <View
                style={Platform.select({
                  web: tailwind(``),
                  native: tailwind(''),
                })}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Add exercise notes"
                    placeholderTextColor="#aaa"
                    multiline={true} // Makes it behave like a textarea
                    numberOfLines={4} // Optional: Adjusts the height
                    textAlignVertical="top" // Aligns text to the top
                  />
                </View>

                <Container
                  style={tailwind('mt-4  flex-row flex-wrap items-center justify-center gap-2')}>
                  <ActionButton
                    uppercase={true}
                    isLoading={isPending}
                    label={'Update Notes'}
                    onPress={handleSubmit}
                    style={tailwind(' grow rounded-md')}
                  />
                </Container>
              </View>
            )}
          </Formik>
        </Container>
      </ModalWrapper>
    </>
  );
};

export default ExerciseNotesModal;

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContainer: {
    maxHeight: 300,
    minHeight: 200,
  },
  workoutItem: {
    marginBottom: 6,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  workoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailInput: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  commonPromptContainer: {
    marginBottom: 10,
  },
  commonPromptButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#493B42',
  },
  commonPromptText: {
    color: 'white',
    fontSize: 12,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
  },
  detailContainerRow: {
    // backgroundColor: 'red',
  },
});
