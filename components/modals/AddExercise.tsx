import React, { useState } from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';
import { Formik } from 'formik';
import { AppTextInput } from '../atoms/AppTextInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExerciseToWorkoutRequest } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import * as yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import { ExerciseElement } from '@/services/interfaces';

const validationSchema = yup.object().shape({
  exerciseName: yup.string().required('Workout name is required'),
});

function AddExercise(props: {
  isModalVisible: boolean;
  closeModal: () => void;
  data: ExerciseElement;
}) {
  const { isModalVisible, closeModal, data } = props;
  const { slug } = useLocalSearchParams() as any;
  const [responseError, setResponseError] = useState<string>();
  const queryClient = useQueryClient();

  const { mutate: mutateAddExercise, isPending } = useMutation({
    mutationFn: addExerciseToWorkoutRequest,
    onSuccess: async data => {
      closeModal();
      return await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
      });
    },
    onError: (error: string) => {
      setResponseError(error);
    },
  });

  const handleAddWorkout = async (values: { exerciseName: string }) => {
    const { exerciseName } = values;
    const payload = {
      formData: {
        name: exerciseName,
        exerciseId: '',
        duration: 0,
        reps: 0,
      },
      queryParams: { id: slug },
    };
    mutateAddExercise(payload);
  };

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={'Enter exercise'}
        closeModal={closeModal}>
        <Container>
          <Formik
            initialValues={{ exerciseName: data?.exercise?.name || '' }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleAddWorkout}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
              <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
                <AppTextInput
                  value={values.exerciseName}
                  placeholder="Enter exercise"
                  onChangeText={handleChange('exerciseName')}
                  errorMessage={errors?.exerciseName}
                  placeholderTextColor={'#fff'}
                  containerStyle={{ marginBottom: 20 }}
                />
                {responseError && (
                  <TextContainer
                    style={tailwind('text-3 text-center text-red-400')}
                    className="text-center text-sm !text-red-400"
                    data={responseError}
                  />
                )}
                <Container style={tailwind('flex flex-row items-center justify-center gap-2')}>
                  <ActionButton
                    label={'Cancel'}
                    onPress={closeModal}
                    isOutline={true}
                    style={tailwind('grow rounded-md')}
                  />
                  <ActionButton
                    uppercase={true}
                    isLoading={isPending}
                    label={'Add'}
                    onPress={handleSubmit}
                    style={tailwind('grow rounded-md')}
                  />
                </Container>
              </Container>
            )}
          </Formik>
        </Container>
        {/* </ScrollView> */}
      </ModalWrapper>
    </>
  );
}

export default AddExercise;
