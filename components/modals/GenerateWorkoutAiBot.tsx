import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import { Ionicons } from '@expo/vector-icons';
import useBreakPoints from '@/hooks/useBreakPoints';
import InitializeChatBot from '../WorkoutChatbot/InitializeChatBot';

interface IGenerateWorkoutAiBot {
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

const GenerateWorkoutAiBot = (props: IGenerateWorkoutAiBot) => {
  const { isVisible, toggleModal } = props;
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();

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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback>
          <View
            style={Platform.select({
              web: tailwind(`mx-auto rounded-lg bg-NAVBAR_BACKGROUND p-4`),
              native: tailwind('rounded-lg bg-NAVBAR_BACKGROUND p-4'),
            })}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              style={[
                Platform.select({
                  web: tailwind(`max-h-[500px]`), // Max height is 500px on web
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
              <InitializeChatBot />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GenerateWorkoutAiBot;

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
