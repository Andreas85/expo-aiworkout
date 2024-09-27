import React, { useState } from 'react';
import Container from '../atoms/Container';
import TextContainer from '../atoms/TextContainer';
import { tailwind } from '@/utils/tailwind';
import ModalWrapper from './ModalWrapper';
import { ActionButton } from '../atoms/ActionButton';
import { Formik } from 'formik';
import { AppTextInput } from '../atoms/AppTextInput';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addWorkoutService } from '@/services/workouts';
import CustomImagePicker from '../atoms/CustomImagePicker';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';

function AddWorkoutModal(props: { isModalVisible: boolean; closeModal: () => void }) {
  const { isModalVisible, closeModal } = props;
  const [responseError, setResponseError] = useState<string>();
  const queryClient = useQueryClient();

  const { mutate: mutateAddWorkout, isPending } = useMutation({
    mutationFn: addWorkoutService,
    onSuccess: async data => {
      closeModal();
      return await queryClient.invalidateQueries({
        queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT],
      });
    },
    onError: (error: string) => {
      setResponseError(error);
    },
  });

  const handleAddWorkout = async (values: { workoutName: string }) => {
    const { workoutName } = values;
    const payload = {
      formData: {
        name: workoutName,
      },
    };
    mutateAddWorkout(payload);
  };

  return (
    <>
      <ModalWrapper
        isModalVisible={isModalVisible}
        headerTitle={'Enter workout'}
        closeModal={closeModal}>
        {/* <ScrollView contentContainerStyle={{ flex: 1 }}> */}
        <Container>
          <Container style={tailwind('')}>
            <CustomImagePicker />
          </Container>
          <Formik
            initialValues={{ workoutName: '' }}
            enableReinitialize={true}
            onSubmit={handleAddWorkout}>
            {({ handleChange, handleSubmit, values, errors, isSubmitting }: any) => (
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

export default AddWorkoutModal;
