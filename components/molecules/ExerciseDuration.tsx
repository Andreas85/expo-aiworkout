import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { formatTime } from '@/utils/helper';
import useBreakPoints from '@/hooks/useBreakPoints';

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
  const { isExtraSmallDevice } = useBreakPoints();
  const showRemainingTime = () => {
    if (remainingTime > 0) {
      return formatTime(remainingTime);
    }
    return formatTime(0);
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.remainingText, fontSize: isExtraSmallDevice ? 24 : 30 }}>
        {showRemainingTime()}
      </Text>
      <View style={{ borderColor: Colors.gray, borderWidth: 1, width: '100%' }} />
      <View>
        <Text style={{ ...styles.text, fontSize: isExtraSmallDevice ? 14 : 16 }}>
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
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  text: {
    fontWeight: 'bold',
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 8,
  },
});
