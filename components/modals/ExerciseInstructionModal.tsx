import { Platform, StyleSheet, View, ScrollView, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { tailwind } from '@/utils/tailwind';
import RenderHTML from 'react-native-render-html';
import ModalWrapper from './ModalWrapper';
import { ExerciseElement } from '@/services/interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { generateWorkoutInstructionService } from '@/services/workouts';
import { REACT_QUERY_API_KEYS } from '@/utils/appConstants';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { debouncedMutate, updateExerciseDataInWorkoutSession } from '@/utils/helper';
import { useWorkoutSessionStore } from '@/store/workoutSessiondetail';
import Colors from '@/constants/Colors';
import { useAuthStore } from '@/store/authStore';
import { ActionButton } from '../atoms/ActionButton';
import Container from '../atoms/Container';

interface IExerciseInstructionModal {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
  item: ExerciseElement;
}

interface PromptExercise {
  exercise_name: string;
  reps: number;
  duration: number;
  weight: number;
  rest: number;
}

const htmlString = `
  <h2>Knee Rolls Exercise</h2>
  <div>
    <div>• <strong>Lie on your back</strong> with knees bent, feet flat...</div>
    <div>• <strong>Slowly lower</strong> both knees to one side...</div>
    <div>• <strong>Hold briefly</strong>, then return to center.</div>
    <div>• <strong>Repeat</strong> on the other side for 8-12 reps per side.</div>
  </div>
  <p>Move gently and keep the core engaged.</p>
`;

export interface ICommonPromts {
  id: number;
  name: string;
  workout: PromptExercise[];
}

const ExerciseInstructionModal = (props: IExerciseInstructionModal) => {
  const { isVisible, toggleModal, item } = props;
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { slug } = useLocalSearchParams() as { slug: string; sessionId?: string };
  const { updateWorkoutExercises } = useWorkoutDetailStore();
  const isWorkoutSessionDetailScreen = useWorkoutSessionStore(
    state => state.isWorkoutSessionDetailScreen,
  );
  const { updateExercisePropertyZustand } = useWorkoutSessionStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const workoutSessionDetails = useWorkoutSessionStore(state => state.workoutSessionDetails);
  const [instructions, setInstructions] = useState<string>('');

  const {
    mutate: mutateUpdateExerciseToWorkoutRequest,
    isPending,
    isError,
  } = useMutation({
    mutationFn: generateWorkoutInstructionService,
    onSuccess: async data => {
      if (isWorkoutSessionDetailScreen) {
        const result = updateExerciseDataInWorkoutSession(
          data?.data?.exercises,
          item.exerciseId ?? '',
        );
        updateExercisePropertyZustand(item.order, 'instructions', result?.instructions);
      } else {
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY_API_KEYS.MY_WORKOUT_DETAILS, slug],
        });
      }
      updateWorkoutExercises(data?.data?.exercises);
    },
    onError: (error: any) => {
      console.log('error', error);
      // toast.show(error, { type: 'danger' });
    },
    onSettled: () => {
      console.log('onSettled');
    },
  });

  // add useEffect to fetch data
  useEffect(() => {
    const pathSegements = pathname.split('/');
    // console.log('iteminstruction-useEffect', item?.instructions, item?.instructions === undefined);
    if (isVisible && item?.instructions === undefined && isAuthenticated) {
      let payload: any = {
        formData: {
          index: item?.order,
          exercise: item,
        },
        queryParams: { id: workoutSessionDetails?.workoutId },
      };

      if (pathSegements?.[1] === 'workout-session') {
        console.log('Api call', payload);
        payload.queryParams = { id: workoutSessionDetails?.workoutId };
        payload.formData.exercise = {
          ...item,
          exercise: {
            name: item?.name ?? '',
          } as { name: string },
        };
      } else if (pathSegements?.[1] === 'workout') {
        payload.queryParams = { id: slug };
      }
      console.log('Api call', payload);
      debouncedMutate(mutateUpdateExerciseToWorkoutRequest, payload);
    }
  }, [isVisible, workoutSessionDetails?.workoutId, slug, pathname, isAuthenticated]);

  useEffect(() => {
    if (item?.instructions) {
      setInstructions(item?.instructions);
    }
  }, [item]);

  const renderInstructionData = () => {
    if (isPending) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loaderText}>Loading exercise instructions...</Text>
        </View>
      );
    }
    if (isError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load instructions. Please try again.</Text>
        </View>
      );
    } else {
      return (
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            maxHeight: 400,
            height: 400,
          }}
          showsVerticalScrollIndicator={false}
          style={styles.commonPromptContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              flexWrap: 'wrap',
              flexGrow: 1, // Allow it to take full space
              flex: 1,
              height: 500,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <RenderHTML
                contentWidth={500}
                htmlParserOptions={{ decodeEntities: true }}
                source={{ html: instructions ?? htmlString }}
                tagsStyles={{
                  html: {
                    width: '100%',
                    // backgroundColor: '#1E1E2E', // Dark modern background
                    padding: 16,
                    borderRadius: 8,
                  },
                  h2: {
                    color: '#E2E8F0', // Light text for contrast
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 12,
                    textTransform: 'capitalize',
                  },
                  ol: {
                    listStyleType: 'none',
                    paddingLeft: 0,
                    marginLeft: 0,
                  },
                  div: {
                    fontSize: 15,
                    marginBottom: 10,
                    lineHeight: 26,
                    color: '#CBD5E1', // Softer color for readability
                    flexDirection: 'column',
                    width: '100%',
                    // flexWrap: 'wrap',

                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: '#2D2D44', // Slight contrast for sectioning
                  },
                  span: {
                    width: '100%',
                    flexWrap: 'wrap',
                    color: '#A5B4FC', // Soft blue for emphasis
                  },
                  strong: {
                    fontWeight: 'bold',
                    color: Colors.brandColor, // A modern golden-yellow for highlights
                  },
                  p: {
                    fontSize: 15,
                    marginTop: 12,
                    color: '#E2E8F0',
                    lineHeight: 26,
                  },
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      );
    }
  };

  const handleSignIn = () => {
    toggleModal();
    router.push('/(auth)/signin');
  };

  return (
    <ModalWrapper
      isModalVisible={isVisible}
      isCrossIconVisible={true}
      headerTitle={'Instructions'}
      closeModal={toggleModal}>
      <View
        style={Platform.select({
          web: tailwind(`min-h-[300px]`),
          native: tailwind('min-h-[300px]'),
        })}>
        {isAuthenticated ? (
          renderInstructionData()
        ) : (
          <Container style={tailwind('w-full items-center justify-center gap-y-4 self-center p-8')}>
            <Text style={tailwind('self-center font-semibold text-white')}>
              Please sign in to perform this action
            </Text>
            <ActionButton label="Sign In" onPress={handleSignIn} />
          </Container>
        )}
      </View>
    </ModalWrapper>
  );
};

export default ExerciseInstructionModal;

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#fff',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
