import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { ActionButton } from '../atoms/ActionButton';
import LabelContainer from '../atoms/LabelContainer';
import StarsIcon from '../atoms/AiStarsIcon';
import Colors from '@/constants/Colors';
import { COMMON_PROMTPS } from '@/utils/appConstants';
import useBreakPoints from '@/hooks/useBreakPoints';

interface IGenerateWorkoutProps {
  isVisible: boolean;
  toggleModal: () => void;
  onComplete?: () => void;
}

interface PromptExercise {
  exercise_name: string;
  reps: number;
  duration: number;
  weight: number;
  rest: number;
}

export interface ICommonPromts {
  id: number;
  name: string;
  workout: PromptExercise[];
}

const GenerateWorkoutModal = (props: IGenerateWorkoutProps) => {
  const { isVisible, toggleModal } = props;
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();
  const { isLargeScreen, isMediumScreen } = useWebBreakPoints();

  const [workouts, setWorkouts] = useState<PromptExercise[]>([
    { exercise_name: 'Kettlebell Swing', reps: 15, duration: 0, weight: 12, rest: 30 },
    { exercise_name: 'Goblet Squat', reps: 12, duration: 0, weight: 16, rest: 60 },
    { exercise_name: 'Kettlebell Row', reps: 10, duration: 0, weight: 12, rest: 45 },
  ]);
  const [prompt, setPrompt] = useState('');

  const generateWorkout = async () => {
    console.log('Generating workout for prompt:', prompt);
    setWorkouts(prev => [
      {
        exercise_name: `${prompt} Kettlebell Swing`,
        reps: 15,
        duration: 0,
        weight: 12,
        rest: 30,
      },
      { exercise_name: 'Goblet Squat', reps: 12, duration: 0, weight: 16, rest: 60 },
      { exercise_name: 'Kettlebell Row', reps: 10, duration: 0, weight: 12, rest: 45 },
      ...prev,
    ]);
    setPrompt('');
  };

  const handleSaveAndCreateWorkout = () => {
    console.log('Workout saved and created!');
    console.table(workouts);
    setWorkouts([]);
    toggleModal();
  };

  const handleClickCommonPrompt = (item: any) => () => {
    console.log('Common prompt clicked:', item);
    setPrompt(item.name);
    setWorkouts(item.workout);
  };

  const handleWorkoutChange = (index: number, field: string, value: number) => {
    // console.log('Workout change:', index, field, value);
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index] = { ...updatedWorkouts[index], [field]: value };
    setWorkouts(updatedWorkouts);
  };

  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    // Clean up the event listeners when the component is unmounted
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="white"
      useNativeDriver={true}
      animationIn="fadeIn"
      animationOut="fadeOut">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          height: '100%',
          width: '100%',
        }}>
        <TouchableWithoutFeedback>
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
              label={`Generate Workout ${JSON.stringify(isExtraSmallDevice)}`}
              labelStyle={styles.header}
              right={<StarsIcon brandColor={Colors.brandColor} />}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={prompt}
                onChangeText={setPrompt}
                placeholder="Enter workout details (e.g., Push-Ups, 15 reps, 60s rest, 30s duration)"
                placeholderTextColor="#aaa"
                multiline={true} // Makes it behave like a textarea
                numberOfLines={isExtraSmallDevice ? 2 : 4} // Optional: Adjusts the height
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
              {COMMON_PROMTPS.map((item: ICommonPromts, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.commonPromptButton}
                  onPress={handleClickCommonPrompt(item)}>
                  <Text style={styles.commonPromptText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView
              style={[
                styles.scrollContainer,
                Platform.select({
                  native: tailwind(`
                    ${
                      isMobileDevice
                        ? isKeyboardVisible
                          ? 'max-h-[300px]' // If keyboard is visible on mobile, max height is 300px
                          : 'max-h-[500px]' // If keyboard is not visible on mobile, max height is 500px
                        : ''
                    }
                    ${
                      isExtraSmallDevice
                        ? isKeyboardVisible
                          ? 'max-h-[230px]' // If keyboard is visible on extra-small device, max height is 230px
                          : 'max-h-[350px]' // If keyboard is not visible on extra-small device, max height is 350px
                        : ''
                    }
                  `),
                }),
              ]}>
              {workouts.map((item, index) => (
                <View key={index} style={styles.workoutItem}>
                  <Text style={styles.workoutText} numberOfLines={1}>
                    {item.exercise_name}
                  </Text>
                  <View
                    style={[styles.detailContainer, !isMediumScreen && styles.detailContainerRow]}>
                    <View style={styles.inputGroup}>
                      <Text
                        numberOfLines={1}
                        style={
                          styles.label
                        }>{`Weight ${isMediumScreen ? '(kg)' : '(in kg)'}`}</Text>
                      <TextInput
                        style={styles.detailInput}
                        value={`${item.weight}`}
                        onChangeText={value => handleWorkoutChange(index, 'weight', Number(value))}
                        placeholder="Weight"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
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
                        onChangeText={value => handleWorkoutChange(index, 'rest', Number(value))}
                        placeholder="Rest"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label} numberOfLines={1}>
                        Number of reps
                      </Text>
                      <TextInput
                        style={styles.detailInput}
                        value={`${item.reps}`}
                        onChangeText={value => handleWorkoutChange(index, 'reps', Number(value))}
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
                        onChangeText={value =>
                          handleWorkoutChange(index, 'duration', Number(value))
                        }
                        placeholder="Duration"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginBottom: 6,
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
    paddingVertical: 5,
    paddingHorizontal: 8,
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
