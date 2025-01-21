import React, { useState } from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';
import { Formik } from 'formik';
import { AppTextInput } from '../atoms/AppTextInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWorkoutService, updateWorkoutDataRequest } from '@/services/workouts';
// import CustomImagePicker from '../atoms/CustomImagePicker';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import * as yup from 'yup';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { getWorkoutDetail } from '@/utils/workoutStorageOperationHelper';
import useWorkoutNonLoggedInUser from '@/hooks/useWorkoutNonLoggedInUser';

const validationSchema = yup.object().shape({
  workoutName: yup.string().required('Workout name is required'),
});

function AddAndEditWorkoutModal(props: {
  isModalVisible: boolean;
  closeModal: () => void;
  isEditWorkout?: boolean;
  refetch?: () => void;
}) {
  const queryClient = useQueryClient();
  const { handleAddWorkoutForNonLoggedInUser, handleEditWorkoutForNonLoggedInUser } =
    useWorkoutNonLoggedInUser();
  const { isModalVisible, closeModal, isEditWorkout } = props;
  const { slug } = useLocalSearchParams() as { slug: string };
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const workoutname = useWorkoutDetailStore(state => state.workoutDetail)?.name ?? '';
  const { setWorkoutDetail } = useWorkoutDetailStore();
  const [responseError, setResponseError] = useState<string>();

  const { mutate: mutateAddWorkout, isPending } = useMutation({
    mutationFn: addWorkoutService,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
      closeModal();
      // refetch?.();
    },
    onError: (error: string) => {
      setResponseError(error);
    },
  });

  const handleUpdateWorkoutDetailForNonLoggedInUser = async (workoutId: string) => {
    const result: any = await getWorkoutDetail(workoutId);
    setWorkoutDetail(result);
    closeModal();
  };

  const { mutate: mutateUpdatedWorkout, isPending: isPendingUpdateWorkout } = useMutation({
    mutationFn: updateWorkoutDataRequest,
    onSuccess: data => {
      // alert('HERE---');
      queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
      // queryClient.setQueryData([REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug], data?.data);
      // queryClient.invalidateQueries({ queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug] });
      setWorkoutDetail(data?.data);
      closeModal();
    },
    onError: (error: string) => {
      setResponseError(error);
    },
  });

  const handleEditWorkoutNonLoggedIn = async (values: { workoutName: string }) => {
    const { workoutName } = values;
    await handleEditWorkoutForNonLoggedInUser({ workoutName });
    await handleUpdateWorkoutDetailForNonLoggedInUser(slug);
  };

  const handleAddWorkout = async (values: { workoutName: string }) => {
    const { workoutName } = values;
    const payload = {
      formData: {
        name: workoutName,
      },
    };
    if (isEditWorkout) {
      if (isAuthenticated) {
        mutateUpdatedWorkout({ ...payload, queryParams: { id: slug } });
      } else {
        handleEditWorkoutNonLoggedIn(values);
      }
    } else {
      if (isAuthenticated) {
        mutateAddWorkout(payload);
      } else {
        handleAddWorkoutForNonLoggedInUser(values);
        closeModal();
      }
    }
  };

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={isEditWorkout ? 'Edit Workout' : 'Enter workout'}
        closeModal={closeModal}>
        {/* <ScrollView contentContainerStyle={{ flex: 1 }}> */}
        <Container>
          {/* <Container style={tailwind('')}>
            <CustomImagePicker />
          </Container> */}
          <Formik
            initialValues={{ workoutName: isEditWorkout ? workoutname : '' }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleAddWorkout}>
            {({ handleChange, handleSubmit, values, errors }: any) => (
              <Container className="w-full space-y-4" style={tailwind('gap-y-4')}>
                <AppTextInput
                  value={values.workoutName}
                  placeholder="Enter workout"
                  onChangeText={handleChange('workoutName')}
                  errorMessage={errors?.workoutName}
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
                    isLoading={isPending || isPendingUpdateWorkout}
                    label={isEditWorkout ? 'Update' : 'Add'}
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

export default AddAndEditWorkoutModal;
