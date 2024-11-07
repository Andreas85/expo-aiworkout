import React, { useState } from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';
import { FieldArray, Formik } from 'formik';
import { AppTextInput } from '../atoms/AppTextInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addExerciseToWorkoutRequest } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import * as yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import CustomSwitch from '../atoms/CustomSwitch';
import { Platform, ScrollView } from 'react-native';
import CustomDropdown from '../atoms/CustomDropdown';

const ERROR_MESSAGE = {
  EXERCISE_REQ: 'Exercise name is required if less than 3 characters.',
  REPS_REQ: 'Reps are required when duration is not specified.',
  DURATION_REQ: 'Duration is required.',
};

const validationSchema = yup.object().shape({
  reps: yup.string().when('isDuration', {
    is: false,
    then: schema => schema.required(ERROR_MESSAGE.REPS_REQ),
  }),
  duration: yup.string().required(ERROR_MESSAGE.DURATION_REQ),
});

interface IFormValues {
  exercise: any;
  name: string;
  reps: string;
  duration: string;
  isDuration: boolean;
  weight: string;
  rest: string;
  optionsCount: string;
}

const initialValues = {
  exercise: {},
  name: '',
  reps: '',
  duration: '',
  isDuration: true,
  weight: '0',
  rest: '0',
  optionsCount: '0',
};

function AddExercise(props: { isModalVisible: boolean; closeModal: () => void }) {
  const { isModalVisible, closeModal } = props;
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

  const handleSearchQuery = (keyword: string, labelValue: string) => {
    console.log({ keyword, labelValue });
  };

  const handleAddWorkout = async (values: IFormValues) => {
    const { duration, reps, weight, rest, name, exercise } = values;

    const payload = {
      queryParams: { id: slug },
      formData: {
        exerciseId: exercise?.value,
        name: exercise?.label || name,
        duration: parseInt(duration),
        reps: reps ? parseInt(reps) : 0,
        weight: weight ? parseFloat(weight) : 0,
        rest: rest ? parseInt(rest) : 0,
      },
    };
    console.log({ payload });

    // mutateAddExercise(payload);
  };

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={'Enter exercise'}
        closeModal={closeModal}>
        <Container>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddWorkout}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting, setFieldValue }: any) => (
              <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
                <ScrollView>
                  <FieldArray name="exercise">
                    {({ field, form }: any) => (
                      <CustomDropdown
                        search={true}
                        searchQuery={handleSearchQuery}
                        open={true}
                        selectedItem={values.exercise}
                        items={[
                          { label: 'Savings', value: 'savings' },
                          { label: 'Checking', value: 'checking' },
                          { label: 'Other', value: 'other' },
                        ]}
                        onchange={value => form.setFieldValue('exercise', value)}
                        placeholder="Select"
                      />
                    )}
                  </FieldArray>
                  <CustomSwitch
                    isEnabled={values.isDuration}
                    toggleSwitch={handleChange('isDuration')}
                    hasRightLabel={true}
                    labelRight={'Duration'}
                    label={'Reps'}
                    labelStyle={[
                      Platform.select({
                        web: tailwind(
                          ' text-center text-xl font-normal not-italic leading-[150%] text-white',
                        ),
                        native: tailwind('text-sm font-bold'),
                      }),
                    ]}
                  />
                  {!values.isDuration && (
                    <AppTextInput
                      value={values.reps}
                      placeholder="Number of reps"
                      onChangeText={handleChange('reps')}
                      errorMessage={errors?.reps}
                      placeholderTextColor={'#fff'}
                      keyboardType="numeric"
                      containerStyle={{ marginBottom: 20 }}
                    />
                  )}
                  <AppTextInput
                    value={values.weight}
                    placeholder="Weight (in kg)"
                    onChangeText={handleChange('weight')}
                    placeholderTextColor={'#fff'}
                    keyboardType="numeric"
                    containerStyle={{ marginBottom: 20 }}
                  />
                  <AppTextInput
                    value={values.rest}
                    placeholder="Rest (in seconds)"
                    onChangeText={handleChange('rest')}
                    placeholderTextColor={'#fff'}
                    keyboardType="numeric"
                    containerStyle={{ marginBottom: 20 }}
                  />
                  <AppTextInput
                    value={values.duration}
                    placeholder={
                      values.isDuration ? 'Reps Duration (in seconds)' : 'Duration (in seconds)'
                    }
                    onChangeText={handleChange('duration')}
                    errorMessage={errors?.duration}
                    placeholderTextColor={'#fff'}
                    keyboardType="numeric"
                    containerStyle={{ marginBottom: 20 }}
                  />

                  {responseError && (
                    <TextContainer
                      style={tailwind('text-3 text-center text-red-400')}
                      className="text-center text-sm !text-red-400"
                      data={responseError}
                    />
                  )}
                  <Container
                    style={tailwind('mt-4 flex flex-row items-center justify-center gap-2')}>
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
                </ScrollView>
              </Container>
            )}
          </Formik>
        </Container>
      </ModalWrapper>
    </>
  );
}

export default AddExercise;
