import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Container from '../atoms/Container';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { tailwind } from '@/utils/tailwind';
import { useWorkoutDetailStore } from '@/store/workoutdetail';

interface IExerciseStartAndPause {
  isTimerRunning: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  showStopButton?: boolean;
  disableControls?: boolean;
}

const ExerciseStartAndPause = (props: IExerciseStartAndPause) => {
  const {
    isTimerRunning,
    onPlay,
    onPause,
    onStop,
    disableControls = false,
    showStopButton = false,
  } = props;

  const renderIcon = () => {
    if (isTimerRunning) {
      // add stop icons
      return (
        <AntDesign
          name="pause"
          size={40}
          color={Colors.white}
          style={[
            tailwind(`rounded-full bg-WORKOUT_PURPLE p-2 ${disableControls ? 'opacity-50' : ''}`),
          ]}
        />
      );
    }
    return (
      <Feather
        name="play"
        size={40}
        color={Colors.white}
        style={[
          tailwind(`rounded-full bg-WORKOUT_PURPLE p-2 ${disableControls ? 'opacity-50' : ''}`),
        ]}
      />
    );
  };
  return (
    <Container>
      {/* Play / Pause Button */}
      <TouchableOpacity onPress={isTimerRunning ? onPause : onPlay} disabled={disableControls}>
        {renderIcon()}
      </TouchableOpacity>

      {/* Stop Button */}
      {showStopButton && (
        <TouchableOpacity
          style={[styles.button, disableControls && styles.disabledButton]}
          onPress={onStop}
          disabled={disableControls}>
          <FontAwesome name={'stop'} size={24} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default ExerciseStartAndPause;

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  pauseButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: Colors.lightGray,
  },
});
