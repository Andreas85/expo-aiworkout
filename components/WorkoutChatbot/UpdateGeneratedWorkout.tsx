import React, { useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ChatMessage } from './ChatMessage';
import { WorkoutPlanView } from './WorkoutPlan';
import { useChatBot } from '@/hooks/useChatBot';

import { WorkoutFeedbackView } from './WorkoutFeedback';
import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useGenerateWorkoutPlanStore } from '@/store/generateWorkoutPlanStore';

function UpdateGeneratedWorkout(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const isKeyboardVisible = useKeyboardVisibility();

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const {
    isWorkoutApproved,
    handleFeedback,
    handleRegenerateWorkout,
    responseError,
    isPendingRegenerateWorkout,
    isPendingUpdateGenerateWorkout,
  } = useChatBot(toggleModal, scrollToBottom);

  const generatedWorkoutPlan = useGenerateWorkoutPlanStore(state => state.generatedWorkoutPlan);
  const workoutPlan = {
    name: generatedWorkoutPlan?.name,
    exercises: generatedWorkoutPlan?.exercises || [],
  };
  useEffect(() => {
    if (isKeyboardVisible) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 200); // Slight delay ensures proper scrolling
    }
  }, [isKeyboardVisible]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // keyboardVerticalOffset={0}
          style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            style={
              [
                // isKeyboardVisible && isExtraSmallDevice ? { height: 200 } : scrollHeightStyle(),
              ]
            }
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}>
            <TouchableOpacity activeOpacity={1}>
              <ChatMessage isBot={true} wrapChildren={true}>
                <WorkoutPlanView
                  plan={{
                    name: generatedWorkoutPlan?.name,
                    exercises: generatedWorkoutPlan?.exercises || [],
                  }}
                  showSaveButton={isWorkoutApproved}
                  toggleModal={toggleModal}
                />
              </ChatMessage>

              <ChatMessage isBot={true} wrapChildren={true}>
                <WorkoutFeedbackView
                  onSubmit={handleFeedback}
                  onSubmitRegenerate={handleRegenerateWorkout}
                  isEditGeneratedWorkout={true}
                  errorMessage={responseError ?? ''}
                  isEditLoading={isPendingRegenerateWorkout || isPendingUpdateGenerateWorkout}
                />
              </ChatMessage>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UpdateGeneratedWorkout;
