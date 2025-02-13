import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import Modal from 'react-native-modal';
import { tailwind } from '@/utils/tailwind';
import { Ionicons } from '@expo/vector-icons';
import useBreakPoints from '@/hooks/useBreakPoints';
import InitializeChatBot from '../WorkoutChatbot/InitializeChatBot';
import LabelContainer from '../atoms/LabelContainer';
import Colors from '@/constants/Colors';
import StarsIcon from '../atoms/AiStarsIcon';
import { useAuthStore } from '@/store/authStore';
import Container from '../atoms/Container';
import NoDataSvg from '../svgs/NoDataSvg';
import { ActionButton } from '../atoms/ActionButton';
import { router } from 'expo-router';

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

// Custom hook for handling keyboard visibility
const useKeyboardVisibility = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardVisible(true));
    const hideListener = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardVisible(false));

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};

const GenerateWorkoutAiBot = ({ isVisible, toggleModal }: IGenerateWorkoutAiBot) => {
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();
  const isKeyboardVisible = useKeyboardVisibility();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Dynamic max height calculation based on device type and keyboard visibility
  const scrollContainerStyle = useCallback(() => {
    if (Platform.OS === 'web') return tailwind('max-h-[500px]');
    if (isMobileDevice) return tailwind(isKeyboardVisible ? 'max-h-[300px]' : 'max-h-[500px]');
    if (isExtraSmallDevice) return tailwind(isKeyboardVisible ? 'max-h-[230px]' : 'max-h-[350px]');
    return undefined;
  }, [isKeyboardVisible, isMobileDevice, isExtraSmallDevice]);

  const handleSignIn = () => {
    toggleModal();
    router.push('/(auth)/signin');
  };

  const renderWorkoutContainer = () => {
    if (isAuthenticated) {
      return <InitializeChatBot toggleModal={toggleModal} />;
    }
    return (
      <Container style={tailwind('w-full items-center justify-center gap-y-4 self-center p-8')}>
        <Text style={tailwind('self-center  font-semibold text-white')}>
          Please sign to perform this action
        </Text>
        <ActionButton label="Sign In" onPress={handleSignIn} />
      </Container>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropColor="white"
      useNativeDriver
      animationIn="fadeIn"
      animationOut="fadeOut">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={Platform.select({
              web: tailwind('mx-auto rounded-lg bg-NAVBAR_BACKGROUND p-4'),
              native: tailwind('rounded-lg bg-NAVBAR_BACKGROUND p-4'),
            })}>
            {/* Close Button */}
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Header */}
            <LabelContainer
              label="Generate Workout"
              labelStyle={styles.header}
              right={<StarsIcon brandColor={Colors.brandColor} />}
            />
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              style={scrollContainerStyle()}>
              {renderWorkoutContainer()}
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
    position: 'absolute',
    top: 16,
    right: 10,
  },
  header: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
