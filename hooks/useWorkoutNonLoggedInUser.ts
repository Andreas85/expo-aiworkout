import { router, useLocalSearchParams } from 'expo-router';
import {
  addExerciseToWorkout,
  addWorkout,
  deleteWorkout,
  duplicateWorkout,
  editWorkout,
} from '@/utils/workoutStorageOperationHelper';
import { ExerciseElement, Workout } from '@/services/interfaces';
import { useToast } from 'react-native-toast-notifications';

const useWorkoutNonLoggedInUser = () => {
  const { slug } = useLocalSearchParams() as { slug: string };
  const toast = useToast();
  // Duplicate workout to the array of workouts in AsyncStorage
  const handleDuplicateWorkoutForNonLoggedInUser = async (workout: Pick<Workout, 'name'>) => {
    const newWorkout = await duplicateWorkout(workout);

    toast.show('Duplicate success', { type: 'success' });
    router.push(`/workout/${newWorkout?._id}`);
  };

  const handleDeleteWorkoutForNonLoggedInUser = async () => {
    await deleteWorkout(slug);
    router.back();
  };

  const handleAddWorkoutForNonLoggedInUser = async ({ workoutName }: { workoutName: string }) => {
    await addWorkout({
      name: workoutName,
    });
  };

  const handleEditWorkoutForNonLoggedInUser = async ({ workoutName }: { workoutName: string }) => {
    await editWorkout(slug, { name: workoutName });
  };

  const handleAddExerciseForNonLoggedInUser = async (exercise: Partial<ExerciseElement>) => {
    await addExerciseToWorkout(slug, exercise);
  };

  return {
    handleAddWorkoutForNonLoggedInUser,
    handleDeleteWorkoutForNonLoggedInUser,
    handleDuplicateWorkoutForNonLoggedInUser,
    handleEditWorkoutForNonLoggedInUser,
    handleAddExerciseForNonLoggedInUser,
  };
};

export default useWorkoutNonLoggedInUser;
