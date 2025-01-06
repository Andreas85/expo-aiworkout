import React, { memo } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import StartWorkoutExerciseCard from '../atoms/StartWorkoutExerciseCard';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import StartWorkoutExerciseCardActive from '../atoms/StartWorkoutExerciseCardActive';

interface StartWorkoutExerciseCardWrapperProps {
  exercise: any;
  isLast: boolean;
  isSelectedWorkout?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  handleNextExercise?: () => void;
  isRestCard?: boolean;
}

const StartWorkoutExerciseCardWrapper = (props: StartWorkoutExerciseCardWrapperProps) => {
  const {
    exercise,
    isLast,
    onIncrement,
    onDecrement,
    isSelectedWorkout,
    handleNextExercise,
    isRestCard = false,
  } = props;
  const { isLargeScreen } = useWebBreakPoints();

  const onIncrementHandler = () => {
    console.log('Increment');
    // set callback to parent
    onIncrement?.();
  };

  const onDecrementHandler = () => {
    console.log('Decrement');
    // set callback to parent
    onDecrement?.();
  };

  const handleExerciseTimeFinished = (
    exerciseDurationTaken: number,
    currentExerciseCompleted: boolean,
  ) => {
    console.log('Exercise Time Finished', { exerciseDurationTaken, currentExerciseCompleted });
    handleNextExercise?.();
  };

  const handleRepsWorkoutFinished = (totalElapsedTime: number) => {
    console.log('Reps Workout Finished', { totalElapsedTime });
    // handleNextExercise?.();
  };

  const renderExerciseCard = () => {
    if (isSelectedWorkout) {
      return (
        <StartWorkoutExerciseCardActive
          item={exercise}
          isRestCard={isRestCard}
          onIncrementHandler={onIncrementHandler}
          onDecrementHandler={onDecrementHandler}
          isExerciseTimeFinished={handleExerciseTimeFinished}
          isRepsWorkoutFinished={handleRepsWorkoutFinished}
        />
      );
    } else {
      return (
        <StartWorkoutExerciseCard
          item={exercise}
          isRestCard={isRestCard}
          onIncrementHandler={onIncrementHandler}
          onDecrementHandler={onDecrementHandler}
        />
      );
    }
  };

  return (
    <View style={{ ...styles.cardContainer }}>
      {/* Timeline Line */}
      <MaterialIcons
        name="fitness-center"
        size={20}
        color={Colors.white}
        style={{
          backgroundColor: Colors.brandColor,
          borderRadius: 12,
          padding: 5,
        }}
      />
      {!isLast && <View style={styles.timelineLine} />}

      {/* Card Content */}
      <View
        style={Platform.select({
          web: tailwind(
            `flex-1 ${isLargeScreen ? `flex-1 flex-col  py-1 ${isSelectedWorkout ? 'px-2' : 'px-10'} py-1` : `${isSelectedWorkout ? 'px-[150px]' : 'px-[220px]'} py-2`}`,
          ),
          native: tailwind(`flex-1 flex-col  py-1 ${isSelectedWorkout ? 'px-2' : 'px-10'} py-2`),
        })}>
        {renderExerciseCard()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: 10,
    marginLeft: 20,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    left: 15,
    height: '100%',
    width: 2,
    backgroundColor: Colors.brandColor,
    zIndex: -1,
    // backgroundColor: 'red',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // padding: 15,
    borderRadius: 10,
    // paddingVertical: 10,
    paddingBottom: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imageContainer: {
    marginRight: 15,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    color: '#BBBBBB',
    fontSize: 14,
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counter: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 10,
  },
});

export default memo(StartWorkoutExerciseCardWrapper);
