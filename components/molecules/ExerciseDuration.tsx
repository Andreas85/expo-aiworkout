import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { formatTime } from '@/utils/helper';

type ExerciseProps = {
  remainingTime: number; // Remaining time in seconds
  elapsedTime: number; // Elapsed time in seconds
  totalWorkoutTime: number; // Total workout time in seconds
};

const ExerciseDuration: React.FC<ExerciseProps> = ({
  remainingTime,
  elapsedTime,
  totalWorkoutTime,
}) => {
  const showRemainingTime = () => {
    if (remainingTime > 0) {
      return formatTime(remainingTime);
    }
    return formatTime(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.remainingText}>{showRemainingTime()}</Text>
      <View style={{ borderColor: Colors.gray, borderWidth: 1, width: '100%' }} />
      <View>
        <Text style={styles.text}>
          {formatTime(elapsedTime)} / {formatTime(totalWorkoutTime)}
        </Text>
      </View>
    </View>
  );
};

export default ExerciseDuration;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
  },
  remainingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 8,
  },
});
