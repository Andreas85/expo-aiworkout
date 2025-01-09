import React, { memo } from 'react';
import { View, Platform, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/Colors';
import StartWorkoutExerciseCard from '../atoms/StartWorkoutExerciseCard';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import StartWorkoutExerciseCardActive from '../atoms/StartWorkoutExerciseCardActive';
import { IMAGES } from '@/utils/images';
import { Entypo } from '@expo/vector-icons';

interface StartWorkoutExerciseCardWrapperProps {
  exercise: any;
  isLast: boolean;
  isSelectedWorkout?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  handleNextExercise?: () => void;
  handleNextRestExercise?: () => void;
  isRestCard?: boolean;
  isFirst?: boolean;
  isCompleted?: boolean;
}

const StartWorkoutExerciseCardWrapper = (props: StartWorkoutExerciseCardWrapperProps) => {
  const {
    exercise,
    isLast,
    onIncrement,
    onDecrement,
    isSelectedWorkout,
    handleNextExercise,
    handleNextRestExercise,
    isRestCard = false,
    isFirst = false,
    isCompleted = false,
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
    handleNextRestExercise?.();
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

  const renderIcons = () => {
    if (!isCompleted) {
      return (
        <View
          style={Platform.select({
            web: tailwind(
              `${isLargeScreen ? ' h-6 w-6' : 'ml-[2px] h-10 w-10'} z-20 items-center justify-center rounded-full border-[2px] border-gray-400 bg-NAVBAR_BACKGROUND`,
            ),
            native: tailwind(
              `ml-2 h-6 w-6 items-center justify-center rounded-full border-[3px] border-gray-400 bg-NAVBAR_BACKGROUND`,
            ),
          })}></View>
      );
    }
    return (
      <Image
        source={IMAGES.muscleIcon}
        resizeMode="contain"
        style={Platform.select({
          web: tailwind(`aspect-video ${isLargeScreen ? 'h-6 w-6' : 'h-10 w-10'}`),
          native: tailwind('aspect-video h-10 w-10'),
        })}
      />
    );
  };

  return (
    <View style={{ ...styles.cardContainer }}>
      {/* Timeline Line */}

      {renderIcons()}
      <View
        style={Platform.select({
          web: {
            ...styles.timelineLine,
            left: isLargeScreen ? 10 : 20,
            height: isFirst ? '50%' : isLast ? '50%' : '100%',
            top: isFirst ? '50%' : 0,
            backgroundColor: isCompleted ? Colors.brandColor : 'transparent',
            borderColor: isCompleted ? Colors.brandColor : Colors.gray,
            borderWidth: 1.8,
            borderStyle: isCompleted ? 'solid' : 'dashed', // Dashed for incomplete
          } as any,
          native: {
            ...styles.timelineLine,
            left: 20,
            height: isFirst ? '50%' : isLast ? '50%' : '100%',
            top: isFirst ? '50%' : 0,
            backgroundColor: isCompleted ? Colors.brandColor : 'transparent',
            borderColor: isCompleted ? Colors.brandColor : Colors.gray,
            borderWidth: 1,
            borderStyle: isCompleted ? 'solid' : 'dashed', // Dashed for incomplete
          } as any,
        })}
      />

      {/* Card Content */}
      <View
        style={Platform.select({
          web: tailwind(
            `flex-1 ${isLargeScreen ? `flex-1 flex-col   ${isSelectedWorkout ? 'px-2' : 'px-10'} py-[2px]` : `${isSelectedWorkout ? 'px-[150px]' : 'px-[220px]'} py-1`}`,
          ),
          native: tailwind(`flex-1 flex-col  py-1 ${isSelectedWorkout ? 'px-2' : 'px-10'} `),
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
    backgroundColor: 'transparent',
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: 2,
    zIndex: -1,
    backgroundColor: 'transparent',
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
