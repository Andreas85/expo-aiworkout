import React, { useCallback } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  useWindowDimensions,
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
import { ActionButton } from '../atoms/ActionButton';
import { router } from 'expo-router';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const GenerateWorkoutAiBot = ({
  isVisible,
  toggleModal,
}: {
  isVisible: boolean;
  toggleModal: () => void;
}) => {
  const { isExtraSmallDevice, isMobileDevice } = useBreakPoints();
  const { isLargeScreen } = useWebBreakPoints();
  const isKeyboardVisible = useKeyboardVisibility();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { height } = useWindowDimensions();

  const getScrollHeight = () => {
    if (Platform.OS === 'web') return isLargeScreen ? 500 : height * 0.9; // Fixed max height for web

    if (isExtraSmallDevice) {
      return isKeyboardVisible ? 340 : height * 0.9;
    }

    if (isMobileDevice) {
      return isKeyboardVisible ? 400 : height * 0.9;
    }

    return height * 0.9;
  };

  const scrollContainerStyle = useCallback(() => {
    return {
      maxHeight: getScrollHeight(),
    };
  }, [isKeyboardVisible, isMobileDevice, isExtraSmallDevice, height]);
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
        <Text style={tailwind('self-center font-semibold text-white')}>
          Please sign in to perform this action
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
      animationOut="fadeOut"
      style={Platform.select({
        // web: tailwind(''),
        web: isLargeScreen ? { margin: 0, justifyContent: 'flex-end' } : {},
        native: { margin: 0, justifyContent: 'flex-end' }, // Full-screen modal
      })}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={Platform.select({
            web: isLargeScreen
              ? styles.modalContainer
              : tailwind('mx-auto w-3/5 rounded-lg bg-NAVBAR_BACKGROUND p-4'),
            native: styles.modalContainer,
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
            style={[scrollContainerStyle(), styles.scrollView]}>
            {renderWorkoutContainer()}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default GenerateWorkoutAiBot;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 16,
    right: 10,
  },
  header: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});
