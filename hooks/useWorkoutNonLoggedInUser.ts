import { router, useLocalSearchParams } from 'expo-router';
import {
  addExerciseToWorkout,
  addWorkout,
  deleteExerciseFromWorkout,
  deleteWorkout,
  duplicateWorkout,
  editExerciseInWorkout,
  editWorkout,
  getWorkoutDetail,
  sortExercisesInWorkout,
} from '@/utils/workoutStorageOperationHelper';
import { ExerciseElement, Workout } from '@/services/interfaces';
import { useToast } from 'react-native-toast-notifications';
import { getReorderItemsForSortingWorkoutExercises } from '@/utils/helper';

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

  const handleSortExerciseInAsyncStorage = async (newCardOrder: number) => {
    const updatedData = await getWorkoutDetail(slug);
    if (newCardOrder) {
      const newIndex = newCardOrder;
      // console.log('INFO::', { newIndex });
      // refetchWorkoutData(slug); // Refetch workout details
      const oldIndex = updatedData.exercises.at(-1)?.order ?? 0; // Ensure oldIndex is a number
      const reorderedItems = updatedData.exercises.sort(
        (a: ExerciseElement, b: ExerciseElement) => a.order - b.order,
      );
      const [movedItem] = reorderedItems.splice(oldIndex, 1); // Remove the dragged item from old index
      reorderedItems.splice(newIndex, 0, movedItem); // Insert it at the new index
      const modifiedData = getReorderItemsForSortingWorkoutExercises(reorderedItems);
      // console.log({ modifiedData }, 'Will sort here');
      handleSortExerciseForNonLoggedInUser(modifiedData);
    }
  };

  const handleAddExerciseForNonLoggedInUser = async (
    exercise: Partial<ExerciseElement>,
    isExerciseCard?: boolean,
    newCardOrder?: number,
  ) => {
    await addExerciseToWorkout(slug, exercise);
    if (isExerciseCard && newCardOrder) {
      await handleSortExerciseInAsyncStorage(newCardOrder);
    }
  };

  const handleEditExerciseForNonLoggedInUser = async (
    exerciseId: string,
    updatedData: Partial<ExerciseElement>,
  ) => {
    await editExerciseInWorkout(slug, exerciseId, updatedData);
  };

  const handleDeleteExerciseForNonLoggedInUser = async (exerciseId: string) => {
    await deleteExerciseFromWorkout(slug, exerciseId);
  };

  const handleSortExerciseForNonLoggedInUser = async (updatedOrder: Record<string, number>) => {
    await sortExercisesInWorkout(slug, updatedOrder);
  };

  return {
    handleAddWorkoutForNonLoggedInUser,
    handleDeleteWorkoutForNonLoggedInUser,
    handleDuplicateWorkoutForNonLoggedInUser,
    handleEditWorkoutForNonLoggedInUser,
    handleAddExerciseForNonLoggedInUser,
    handleEditExerciseForNonLoggedInUser,
    handleDeleteExerciseForNonLoggedInUser,
    handleSortExerciseForNonLoggedInUser,
  };
};

export default useWorkoutNonLoggedInUser;
