import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { Audio } from 'expo-av';
import StartWorkoutExerciseCard from '../atoms/StartWorkoutExerciseCard';
import { ExerciseElement } from '@/services/interfaces';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import countSound from '@/assets/sounds/film-countdown.mp3';
import PercentageCircle from '../atoms/PercentageCircle';

interface IBaseTimerProps {
  isVisible: boolean;
  toggleModal: () => void;
  currentExercise: ExerciseElement;

  onComplete: () => void; // Callback when timer finishes
}

const BaseTimer = (props: IBaseTimerProps) => {
  const { isVisible, currentExercise, onComplete } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const [countdown, setCountdown] = useState<number>(5);
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(countSound as any);
      soundRef.current = sound;
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync(); // Replay the loaded sound
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadSound(); // Preload the sound when the modal becomes visible
      setCountdown(5); // Reset the countdown when modal opens
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) {
            playSound(); // Play countdown sound
            return prev - 1;
          } else {
            // Timer ends
            clearInterval(intervalRef.current!);
            stopSound();
            onComplete?.(); // Trigger the callback
            return 0;
          }
        });
      }, 1000);
    } else {
      // Cleanup when modal closes
      clearInterval(intervalRef.current!);
      stopSound();
    }

    return () => {
      clearInterval(intervalRef.current!);
      stopSound();
    };
  }, [isVisible]);

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View
        style={Platform.select({
          web: tailwind(
            `items-center rounded-lg bg-NAVBAR_BACKGROUND p-4 ${isLargeScreen ? '' : 'mx-auto w-[55rem]'}`,
          ),
          native: tailwind(`items-center rounded-lg bg-NAVBAR_BACKGROUND p-4`),
        })}>
        {/* Circular Progress Indicator */}
        <PercentageCircle totalDurationTime={5} remainingTime={countdown} />

        <Text style={styles.nextText}>NEXT</Text>

        <StartWorkoutExerciseCard
          item={currentExercise}
          onDecrementHandler={() => {}}
          onIncrementHandler={() => {}}
        />
      </View>
    </Modal>
  );
};

export default BaseTimer;

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7B61FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  nextText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
