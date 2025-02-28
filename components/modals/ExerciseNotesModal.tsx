import { Platform, StyleSheet, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { ActionButton } from '../atoms/ActionButton';
import ModalWrapper from './ModalWrapper';
import Container from '../atoms/Container';
import { Formik } from 'formik';
import { useAuthStore } from '@/store/authStore';
import { updateExercisePropertyOfWorkout } from '@/utils/workoutStorageOperationHelper';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import { updateExerciseProperty } from '@/utils/workoutSessionHelper';
import { useLocalSearchParams } from 'expo-router';
import { ExerciseElement } from '@/services/interfaces';

interface IExerciseNotesModal {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
  item: ExerciseElement;
}

const ExerciseNotesModal = (props: IExerciseNotesModal) => {
  const { isVisible, toggleModal, item } = props;
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { isExtraSmallScreenOnly } = useWebBreakPoints();
  const { updateExercisePropertyZustand } = useWorkoutSessionStore();
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [notes, setNotes] = useState<string>(item.notes ?? '');

  const handleAddNotes = async () => {
    console.log('Add Notes', {
      notes,
    });
    if (isAuthenticated) {
      // Add notes to the workout
    } else {
      await updateExerciseProperty(slug ?? '', item?._id ?? '', 'notes', notes);
      updateExercisePropertyOfWorkout(
        workoutSessionDetails?.workoutId ?? '',
        item?._id,
        'notes',
        notes,
      );
    }
    updateExercisePropertyZustand(item.order, 'notes', notes);
    toggleModal();
  };

  return (
    <>
      <ModalWrapper
        isModalVisible={isVisible}
        isCrossIconVisible={true}
        headerTitle={'Notes'}
        closeModal={toggleModal}>
        <Container>
          <Formik
            initialValues={{
              notes: '',
            }}
            validateOnChange={false} // Disable validation on field change
            validateOnBlur={true} // Enable validation on blur
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
                    placeholder="Add exercise notes (e.g., Plank, 3 sets, 60s hold, 15s rest)"
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
                    disabled={!notes}
                    // isLoading={isPending || isPendingSort}
                    label={'Add'}
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
