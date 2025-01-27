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
  fetchExerciseService,
  sortExercisesRequest,
} from '@/services/workouts';
import { REACT_QUERY_API_KEYS, REACT_QUERY_STALE_TIME } from '@/utils/appConstants';
import * as yup from 'yup';
import { useLocalSearchParams } from 'expo-router';
import CustomSwitch from '../atoms/CustomSwitch';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { ExerciseElement } from '@/services/interfaces';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { View } from '../Themed';
import { getReorderItemsForSortingWorkoutExercises, isValidUUID } from '@/utils/helper';
import { useToast } from 'react-native-toast-notifications';
import CustomDropdown from '../atoms/CustomDropdown';
import { useFetchData } from '@/hooks/useFetchData';
import useWorkoutNonLoggedInUser from '@/hooks/useWorkoutNonLoggedInUser';
import { useAuthStore } from '@/store/authStore';
import {
  addWorkoutExercises,
  getWorkoutExercisesList,
  IWorkoutExercisesHelper,
} from '@/utils/workoutExercisesHelper';

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
  const { handleAddExerciseForNonLoggedInUser } = useWorkoutNonLoggedInUser();
  const { slug } = useLocalSearchParams() as any;
  const toast = useToast();
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [responseError, setResponseError] = useState<string>();
  const [filteredExercises, setFilteredExercises] = useState<any>([]);
  const queryClient = useQueryClient();
  const cachedPublicExerciseData: any =
    queryClient.getQueryData([REACT_QUERY_API_KEYS.PUBLIC_EXERCISES]) ?? [];
  const cachedMyExerciseData: any = queryClient.getQueryData([REACT_QUERY_API_KEYS.MY_EXERCISES]);
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
    const exerciseData = {
      exerciseId: exercise?._id,
      name: !exercise?._id ? exercise : `${exercise?.name || ''} `,
      duration: parseInt(duration),
      reps: reps ? parseInt(reps) : 0,
      weight: weight ? parseFloat(weight) : 0,
      rest: rest ? parseInt(rest) : 0,
    };

    // i want to add exerciseId conditionally in exerciseData object
    if (isValidUUID(exercise?._id) && isAuthenticated) {
      delete exerciseData.exerciseId;
    }
    console.log('(exerciseData)INFO:: ', { exerciseData });

    const payload = {
      queryParams: { id: slug },
      formData: exerciseData,
    };
    if (isAuthenticated) {
      mutateAddExerciseToWorkout(payload);
    } else {
      // console.log('Not add exercise', { isExerciseCard, newCardOrder });
      handleAddExerciseForNonLoggedInUser(exerciseData, isExerciseCard, newCardOrder);
      closeModal();
    }
  };

  const { data, isSuccess } = useFetchData({
    queryFn: fetchExerciseService,
    queryKey: [REACT_QUERY_API_KEYS.MY_EXERCISES],
    staleTime: REACT_QUERY_STALE_TIME.MY_EXERCISES,
    enabled: isAuthenticated,
  });

  const updateFilteredExercises = async (
    cachedPublicExerciseData: any,
    cachedMyExerciseData: any,
  ) => {
    const localExercises = await getWorkoutExercisesList();
    setFilteredExercises(
      [...(cachedMyExerciseData ?? []), ...cachedPublicExerciseData, ...localExercises].map(
        (item: any) => ({
          ...item,
          label: item?.name,
          value: item?._id,
        }),
      ),
    );
  };

  useEffect(() => {
    if (cachedPublicExerciseData || cachedMyExerciseData) {
      // console.log({ cachedMyExerciseData }, { data });
      updateFilteredExercises(cachedPublicExerciseData, cachedMyExerciseData);
    }
  }, [cachedPublicExerciseData, isSuccess, cachedMyExerciseData, data]);

  const addNewExerciseInAsyncStorage = async (data: IWorkoutExercisesHelper) => {
    await addWorkoutExercises(data);
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
            {({ handleChange, handleSubmit, values, errors, setFieldValue }: any) => (
              <Container style={tailwind('gap-y-4')}>
                <ScrollView>
                  <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>
                    {/* <Text>{JSON.stringify(values?.exercise)}</Text> */}
                    <FieldArray name="exercise">
                      {() => (
                        <CustomDropdown
                          open={true}
                          search={true}
                          // searchQuery={values?.exercise}
                          selectedItem={values?.exercise}
                          items={filteredExercises}
                          onchange={(value: IWorkoutExercisesHelper) => {
                            const isNewsExercise =
                              filteredExercises.findIndex(
                                (item: IWorkoutExercisesHelper) => item._id === value?._id,
                              ) === -1;

                            // console.log('INFO:: isLabelValueObject', {
                            //   value,
                            //   isLabelValueObject: isLabelValueObject(value),
                            //   isNewsExercise,
                            // });
                            setFieldValue('exercise', value, false);
                            if (isNewsExercise) {
                              addNewExerciseInAsyncStorage(value);
                            }
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
