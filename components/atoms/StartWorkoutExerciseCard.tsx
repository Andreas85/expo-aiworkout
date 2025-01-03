import React from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StartWorkoutExerciseCardProps {
  exercise: any;
  isLast: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

const StartWorkoutExerciseCard = (props: StartWorkoutExerciseCardProps) => {
  const { exercise, isLast, onIncrement, onDecrement } = props;
  return (
    <View style={styles.cardContainer}>
      {/* Timeline Line */}
      {!isLast && <View style={styles.timelineLine} />}

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Image and Info */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: exercise.image }} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.details}>
            {exercise.type === 'duration'
              ? `Duration: ${exercise.duration} seconds`
              : `No. of Reps: ${exercise.reps}`}
          </Text>
        </View>

        {/* Controls */}
        {exercise.type === 'reps' && (
          <View style={styles.controls}>
            <TouchableOpacity onPress={onDecrement}>
              <Ionicons name="remove-circle" size={24} color="#6B6B6B" />
            </TouchableOpacity>
            <Text style={styles.counter}>{exercise.reps}</Text>
            <TouchableOpacity onPress={onIncrement}>
              <Ionicons name="add-circle" size={24} color="#6B6B6B" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginLeft: 20,
    height: 80,
    marginRight: 10,
  },
  timelineLine: {
    position: 'absolute',
    top: 0,
    left: 15,
    height: '100%',
    width: 2,
    // backgroundColor: '#6B6B6B',
    backgroundColor: 'red',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#282828',
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

export default StartWorkoutExerciseCard;
