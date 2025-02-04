import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { Ionicons } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';

interface IGenerateWorkoutProps {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
}

const commonPrompts = [
  'Upper Body Strength Routine',
  'Full Body HIIT Session',
  'Core and Abs Workout',
  'Lower Body Power Exercises',
];

const GenerateWorkoutModal = (props: IGenerateWorkoutProps) => {
  const { isVisible, toggleModal } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const [workouts, setWorkouts] = useState([
    { name: 'Kettlebell Swing', reps: 15, duration: '0 min', weight: '12 kg', rest: '30 sec' },
    { name: 'Goblet Squat', reps: 12, duration: '0 min', weight: '16 kg', rest: '60 sec' },
    { name: 'Kettlebell Row', reps: 10, duration: '0 min', weight: '12 kg', rest: '45 sec' },
  ]);
  const [prompt, setPrompt] = useState('');
  const generateWorkout = async () => {
    const newWorkout = {
      id: Math.random().toString(),
      name: prompt,
      reps: 15,
      duration: '0 min',
      weight: '0 kg',
      rest: '45 sec',
    };
    setWorkouts([...workouts, newWorkout]);
    setPrompt('');
  };

  const handleSaveAndCreateWorkout = () => {
    console.log('Workout saved and created!');
    setWorkouts([]);
    toggleModal();
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="white"
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <View
        style={Platform.select({
          web: tailwind(
            `rounded-lg bg-NAVBAR_BACKGROUND p-4 ${isLargeScreen ? '' : 'mx-auto w-[55rem]'}`,
          ),
          native: tailwind('rounded-lg bg-NAVBAR_BACKGROUND p-4'),
        })}>
        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.header}>Generate Workout</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt"
            placeholderTextColor="#aaa"
          />

          <ActionButton
            label="Generate"
            disabled={!prompt}
            onPress={generateWorkout}
            style={tailwind('rounded-xl')}
          />
        </View>

        {/* Common Prompts Section */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.commonPromptContainer}>
          {commonPrompts.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.commonPromptButton}
              onPress={() => setPrompt(item)}>
              <Text style={styles.commonPromptText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.scrollContainer}>
          {workouts.map((item, index) => (
            <View key={index} style={styles.workoutItem}>
              <Text style={styles.workoutText}>{item.name}</Text>
              <Text style={styles.detailText}>
                Reps: {item.reps}, Duration: {item.duration}, Weight: {item.weight}, Rest:{' '}
                {item.rest}
              </Text>
            </View>
          ))}
        </ScrollView>
        {workouts.length !== 0 && (
          <TouchableOpacity
            style={tailwind(`mt-4 rounded-lg bg-purple-600 p-3`)}
            onPress={handleSaveAndCreateWorkout}>
            <Text style={tailwind(`text-center font-bold uppercase text-white`)}>
              Save and create workout
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default GenerateWorkoutModal;

const styles = StyleSheet.create({
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContainer: {
    maxHeight: 300,
  },
  workoutItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
  },
  workoutText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailText: {
    fontSize: 14,
    color: '#ccc',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  generateButton: {
    backgroundColor: '#6a5acd',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  commonPromptContainer: {
    marginBottom: 10,
  },
  commonPromptButton: {
    backgroundColor: '#6a5acd',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  commonPromptText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
