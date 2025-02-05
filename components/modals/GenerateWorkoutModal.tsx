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
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import LabelContainer from '../atoms/LabelContainer';
import StarsIcon from '../atoms/AiStarsIcon';
import { debounce } from 'lodash';
import Colors from '@/constants/Colors';

interface IGenerateWorkoutProps {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
}

const commonPrompts = [
  {
    id: 1,
    title: 'Upper Body Strength Routine',
    description: 'Focus on building upper body strength with compound exercises.',
    workouts: [
      { name: 'Push-Ups', reps: 15, duration: 0, weight: 10, rest: 30 },
      { name: 'Pull-Ups', reps: 10, duration: 0, weight: 10, rest: 45 },
      {
        name: 'Dumbbell Bench Press',
        reps: 12,
        duration: '0 min',
        weight: '20 kg',
        rest: '60 sec',
      },
    ],
  },
  {
    id: 2,
    title: 'Full Body HIIT Session',
    description: 'High-intensity interval training for full-body fat burn.',
    workouts: [
      { name: 'Burpees', reps: 20, duration: 0, weight: 10, rest: 30 },
      {
        name: 'Mountain Climbers',
        reps: 30,
        duration: '0 min',
        weight: 10,
        rest: '30 sec',
      },
      { name: 'Jump Squats', reps: 15, duration: 0, weight: 10, rest: 45 },
    ],
  },
  {
    id: 3,
    title: 'Core and Abs Workout',
    description: 'Strengthen your core muscles with focused ab exercises.',
    workouts: [
      { name: 'Plank', reps: 0, duration: 60, weight: 10, rest: 30 },
      { name: 'Russian Twists', reps: 20, duration: 0, weight: 5, rest: 30 },
      { name: 'Leg Raises', reps: 15, duration: 0, weight: 10, rest: 45 },
    ],
  },
  {
    id: 4,
    title: 'Lower Body Power Exercises',
    description: 'Boost leg strength and explosiveness with these exercises.',
    workouts: [
      { name: 'Squats', reps: 15, duration: 0, weight: 10, rest: 60 },
      { name: 'Lunges', reps: 12, duration: 0, weight: 10, rest: 45 },
      { name: 'Deadlifts', reps: 10, duration: 0, weight: 40, rest: 90 },
    ],
  },
];

const GenerateWorkoutModal = (props: IGenerateWorkoutProps) => {
  const { isVisible, toggleModal } = props;
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();

  const [workouts, setWorkouts] = useState([
    { name: 'Kettlebell Swing', reps: 15, duration: 0, weight: 12, rest: 30 },
    { name: 'Goblet Squat', reps: 12, duration: 0, weight: 16, rest: 60 },
    { name: 'Kettlebell Row', reps: 10, duration: 0, weight: 12, rest: 45 },
  ]);
  const [prompt, setPrompt] = useState('');

  const generateWorkout = async () => {
    console.log('Generating workout for prompt:', prompt);
    setWorkouts(prev => [
      {
        name: `${prompt} Kettlebell Swing`,
        reps: 15,
        duration: 0,
        weight: 12,
        rest: 30,
      },
      { name: 'Goblet Squat', reps: 12, duration: 0, weight: 16, rest: 60 },
      { name: 'Kettlebell Row', reps: 10, duration: 0, weight: 12, rest: 45 },
      ...prev,
    ]);
    setPrompt('');
  };

  const handleSaveAndCreateWorkout = () => {
    console.log('Workout saved and created!');
    setWorkouts([]);
    toggleModal();
  };

  const handleClickCommonPrompt = (item: any) => () => {
    console.log('Common prompt clicked:', item);
    setPrompt(item.title);
    setWorkouts(item.workouts);
  };

  const handleWorkoutChange = (index: number, field: string, value: string) => {
    console.log('Workout change:', index, field, value);
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index] = { ...updatedWorkouts[index], [field]: value };
    setWorkouts(updatedWorkouts);
  };

  // const handleTextChange = debounce((fieldName: string, text: string, index: number) => {
  //   console.log('Field name:', fieldName, 'Text:', text);
  //   const updatedWorkouts = [...workouts];
  //   updatedWorkouts[index] = { ...updatedWorkouts[index], [fieldName]: text };
  //   setWorkouts(updatedWorkouts);
  // }, 1000);

  // console.log('Workouts:', workouts);

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

        <LabelContainer
          label="Generate Workout"
          labelStyle={styles.header}
          right={<StarsIcon brandColor={Colors.brandColor} />}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Enter your prompt"
            placeholderTextColor="#aaa"
            multiline={true} // Makes it behave like a textarea
            numberOfLines={4} // Optional: Adjusts the height
            textAlignVertical="top" // Aligns text to the top
          />

          <ActionButton
            label=""
            disabled={!prompt}
            onPress={generateWorkout}
            style={tailwind('rounded-xl px-4')}
            left={<FontAwesome6 name="arrow-up-long" size={24} color="#fff" />}
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
              onPress={handleClickCommonPrompt(item)}>
              <Text style={styles.commonPromptText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.scrollContainer}>
          {workouts.map((item, index) => (
            <View key={index} style={styles.workoutItem}>
              <Text style={styles.workoutText} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[styles.detailContainer, !isMediumScreen && styles.detailContainerRow]}>
                <View style={styles.inputGroup}>
                  <Text
                    numberOfLines={1}
                    style={styles.label}>{`Weight ${isMediumScreen ? '(kg)' : '(in kg)'}`}</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={`${item.weight}`}
                    onChangeText={value => handleWorkoutChange(index, 'weight', value)}
                    placeholder="Weight"
                    placeholderTextColor="#aaa"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text
                    numberOfLines={1}
                    style={
                      styles.label
                    }>{`Rest ${isMediumScreen ? '(sec)' : '(in seconds)'}`}</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={`${item.rest}`}
                    onChangeText={value => handleWorkoutChange(index, 'rest', value)}
                    placeholder="Rest"
                    placeholderTextColor="#aaa"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label} numberOfLines={1}>
                    Number of reps
                  </Text>
                  <TextInput
                    style={styles.detailInput}
                    value={`${item.reps}`}
                    onChangeText={value => handleWorkoutChange(index, 'reps', value)}
                    placeholder="Reps"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text
                    numberOfLines={1}
                    style={
                      styles.label
                    }>{`Duration ${isMediumScreen ? '(sec)' : '(in seconds)'}`}</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={`${item.duration}`}
                    onChangeText={value => handleWorkoutChange(index, 'duration', value)}
                    placeholder="Duration"
                    placeholderTextColor="#aaa"
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {workouts.length !== 0 && (
          <ActionButton
            label="Save and create workout"
            onPress={handleSaveAndCreateWorkout}
            style={tailwind('w-full rounded-xl')}
          />
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
  },
  scrollContainer: {
    maxHeight: 300,
    minHeight: 200,
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
    marginBottom: 8,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  detailInput: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 8,
    borderRadius: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#2c2c3e',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  commonPromptContainer: {
    marginBottom: 10,
  },
  commonPromptButton: {
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#493B42',
  },
  commonPromptText: {
    color: 'white',
    fontSize: 12,
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
    color: '#fff',
    textAlign: 'center',
  },
  detailContainerRow: {
    // backgroundColor: 'red',
  },
});
