import React, { useEffect, useState } from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';
import { FieldArray, Formik } from 'formik';
import { AppTextInput } from '../atoms/AppTextInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addExerciseToWorkoutRequest,
  exerciseAutoSuggest,
  fetchExerciseService,
  fetchPublicExerciseService,
  sortExercisesRequest,
} from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import * as yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import CustomSwitch from '../atoms/CustomSwitch';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomAutoComplete from '../atoms/CustomAutoComplete';

import { ExerciseElement } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { Text, View } from '../Themed';
import { getReorderItemsForSortingWorkoutExercises } from '@/utils/helper';
import { useToast } from 'react-native-toast-notifications';
import CustomDropdown from '../atoms/CustomDropdown';
import { useFetchData } from '@/hooks/useFetchData';

const ERROR_MESSAGE = {
  EXERCISE_REQ: 'Exercise name is required if less than 3 characters.',
  REPS_REQ: 'Reps are required when duration is not specified.',
  DURATION_REQ: 'Duration is required.',
};

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

const validationSchema = yup.object().shape({
  reps: yup.string().when('isDuration', {
    is: false,
    then: schema => schema.required(ERROR_MESSAGE.REPS_REQ),
  }),
  duration: yup.string().required(ERROR_MESSAGE.DURATION_REQ),
});

const initialValues = {
  exercise: {},
  name: '',
  reps: '',
  duration: '',
  isDuration: true,
  weight: '',
  rest: '',
  optionsCount: '0',
};

function AddExercise(props: {
  isModalVisible: boolean;
  closeModal: () => void;
  isExerciseCard?: boolean;
  newCardOrder?: number;
}) {
  const { isModalVisible, closeModal, isExerciseCard, newCardOrder } = props;
  const { slug } = useLocalSearchParams() as any;
  const toast = useToast();
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const [responseError, setResponseError] = useState<string>();
  const [filteredExercises, setFilteredExercises] = useState<any>([]);
  const [isNewExercise, setIsNewExercise] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const cachedPublicExerciseData: any = queryClient.getQueryData([
    REACT_QUERY_API_KEYS.PUBLIC_EXERCISES,
  ]);
  const { mutate: mutateAddExerciseToWorkout, isPending } = useMutation({
    mutationFn: addExerciseToWorkoutRequest,
    onSuccess: async data => {
      if (isExerciseCard) {
        const oldIndex = data?.data?.exercises?.at(-1)?.order;
        const reorderedItems = data?.data?.exercises?.sort(
          (a: ExerciseElement, b: ExerciseElement) => a.order - b.order,
        );
        const [movedItem] = reorderedItems.splice(oldIndex, 1); // Remove the dragged item from old index
        reorderedItems.splice(newCardOrder, 0, movedItem); // Insert it at the new index

        const modifiedData = getReorderItemsForSortingWorkoutExercises(reorderedItems);
        const payload = {
          queryParams: { id: slug },
          formData: { ...modifiedData },
        };
        mutateSortExercise(payload);
        return;
      }
      console.log({ slug });
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
      });
      queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      // setWorkoutDetail(_.cloneDeep(data?.data));
      updateWorkoutExercises(data?.data?.exercises);
      closeModal();
    },
    onError: (error: string) => {
      setResponseError(error);
      toast.show(error, { type: 'danger' });
    },
  });

  const { mutate: mutateSortExercise, isPending: isPendingSort } = useMutation({
    mutationFn: sortExercisesRequest,
    onSuccess: async data => {
      // queryClient.invalidateQueries({
      //   queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      // });
      queryClient.invalidateQueries({ queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug] });
      queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      updateWorkoutExercises(data?.data?.exercises);
      // setWorkoutDetail(data?.data);
    },
    onError: (error: any) => {
      toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      closeModal();
    },
  });

  const handleAddWorkout = async (values: IFormValues) => {
    const { duration, reps, weight, rest, exercise } = values;

    const payload = {
      queryParams: { id: slug },
      formData: {
        exerciseId: exercise?._id,
        name: !exercise?._id ? exercise : '',
        duration: parseInt(duration),
        reps: reps ? parseInt(reps) : 0,
        weight: weight ? parseFloat(weight) : 0,
        rest: rest ? parseInt(rest) : 0,
      },
    };
    console.log({ values }, { payload });

    mutateAddExerciseToWorkout(payload);
  };

  useEffect(() => {
    if (cachedPublicExerciseData) {
      setFilteredExercises(
        cachedPublicExerciseData.map((item: any) => ({
          ...item,
          label: item?.name,
          value: item?._id,
        })),
      );
    }
  }, [cachedPublicExerciseData]);

  const isLabelValueObject = (input: any): boolean =>
    input && typeof input === 'object' && 'label' in input && 'value' in input;

  // Fetch exercises based on the query input
  const handleExercisesOptionsFetch = async (input: string) => {
    if (!input) return [];
    try {
      const response = await exerciseAutoSuggest(input);
      return response || [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
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
            validateOnChange={false} // Disable validation on field change
            validateOnBlur={true} // Enable validation on blur
            onSubmit={handleAddWorkout}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting, setFieldValue }: any) => (
              <Container style={tailwind('gap-y-4')}>
                <ScrollView>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    {/* <Text>{JSON.stringify(values?.exercise)}</Text> */}
                    <FieldArray name="exercise">
                      {({ field, form }: any) => (
                        <CustomDropdown
                          open={true}
                          search={true}
                          // searchQuery={values?.exercise}
                          selectedItem={values?.exercise}
                          items={filteredExercises}
                          onchange={(value: ExerciseElement) => {
                            console.log({ value }, isLabelValueObject(value));
                            setFieldValue('exercise', value, false);
                          }}
                          placeholder="Select"
                        />
                      )}
                    </FieldArray>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                      }}>
                      <CustomSwitch
                        isEnabled={values?.isDuration}
                        toggleSwitch={handleChange('isDuration')}
                        hasRightLabel={true}
                        labelRight={'Duration'}
                        label={'Reps'}
                        containerWebStyle={'w-max self-end'}
                        containerStyle={tailwind('mt-10 ')}
                        labelStyle={[
                          Platform.select({
                            web: tailwind(
                              ' text-center text-xl font-normal not-italic leading-[150%] text-white',
                            ),
                            native: tailwind('text-sm font-bold'),
                          }),
                        ]}
                      />
                    </View>
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
                      style={tailwind(
                        'mt-4  flex-row flex-wrap items-center justify-center gap-2',
                      )}>
                      <ActionButton
                        label={'Cancel'}
                        onPress={closeModal}
                        isOutline={true}
                        style={tailwind(' grow rounded-md')}
                      />
                      <ActionButton
                        uppercase={true}
                        isLoading={isPending || isPendingSort}
                        label={'Add to workout'}
                        onPress={handleSubmit}
                        style={tailwind(' grow rounded-md')}
                      />
                    </Container>
                  </KeyboardAvoidingView>
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
