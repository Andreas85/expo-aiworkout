import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import {
  addWorkoutSession,
  updateExerciseInSession,
  updateWorkoutSessionStatus,
} from '@/utils/workoutSessionHelper';
import { generateBigNumberId } from '@/utils/helper';
import { useWorkoutDetailStore } from '@/store/workoutdetail';
import {
  createWorkoutSession,
  updateWorkoutSessionFinishedStatus,
  updateWorkoutSessionService,
} from '@/services/workouts';
import { WORKOUT_STATUS } from '@/utils/appConstants';

const useWorkoutSessionDetailsTracking = () => {
  const { slug } = useLocalSearchParams() as { slug: string };

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const workoutDetail = useWorkoutDetailStore(state => state.workoutDetail);
  const userData = useAuthStore(state => state.userData);
  const { setWorkoutDetail } = useWorkoutDetailStore();

  const handleAddWorkoutSession = async (props: { setLoading: (loading: boolean) => void }) => {
    const { setLoading } = props;
    setLoading(true);
    if (isAuthenticated && workoutDetail) {
      console.log('(API_CALLING) INFO:: handleAddWorkoutSession');
      // Sync workout with the server
      const { data: dataWorkoutSessionDetails } = await createWorkoutSession({
        formData: {
          id: workoutDetail?._id,
        },
      });
      // const results = dataWorkoutSessionDetails?.workout;
      const sessionId = dataWorkoutSessionDetails?._id;
      setLoading(false);
      // const updatedData = { ...results, status: dataWorkoutSessionDetails?.status };
      // console.log('(isAuthenticated-workout-session-details) INFO:: ');
      // setWorkoutDetail(updatedData);
      router.push(`/workout-session/${sessionId}` as any);
      return;
    }
    const sessionId = generateBigNumberId();
    const payload = {
      _id: sessionId,
      workoutId: workoutDetail?._id ?? '',
      exercises: workoutDetail?.exercises ?? [],
      status: 'pending',
      totalDuration: 0,
      totalExercisesCompleted: 0,
      totalWeightTaken: 0,
      totalRestTaken: 0,
      duration: 0,
      remainingTime: 0,
      user: userData ? userData?._id : '',
      name: workoutDetail?.name ?? '',
      createdAt: new Date().toISOString(),
    };
    await addWorkoutSession(payload);
    setLoading(false);
    router.push(`/workout-session/${sessionId}` as any);
  };

  const handleUpdateExerciseInWorkoutSession = async (payload: {
    sessionId: string;
    exerciseId: string;
    durationTaken: number;
    repsTaken: number;
    isLastExerciseCard?: boolean;
  }) => {
    const { sessionId, exerciseId, durationTaken, repsTaken, isLastExerciseCard } = payload;
    if (isAuthenticated) {
      // Sync exercise with the server
      console.log('(API_CALLING) INFO:: handleUpdateExerciseInWorkoutSession');
      // Update each exercise for the workout session
      await updateWorkoutSessionService({
        id: sessionId, // Use the synced session ID
        formData: {
          exerciseId: exerciseId, // ID of the exercise
          durationTaken: durationTaken,
          isCompleted: true,
          repsTaken: repsTaken,
          // Add other necessary fields
        },
      });
      if (isLastExerciseCard) {
        // Update the workout session status
        await updateWorkoutSessionFinishedStatus({
          id: sessionId,
          formData: {
            status: WORKOUT_STATUS.FINISHED,
          },
        });
      }
      return;
    }

    await updateExerciseInSession(sessionId, exerciseId, durationTaken, repsTaken);
    if (isLastExerciseCard) {
      await updateWorkoutSessionStatus(slug, 'FINISHED');
    }
  };
  return {
    handleUpdateExerciseInWorkoutSession,
    handleAddWorkoutSession,
  };
};

export default useWorkoutSessionDetailsTracking;
