import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useChatBot } from '@/hooks/useChatBot';

import { useKeyboardVisibility } from '@/hooks/useKeyboardVisibility';
import { useGenerateWorkoutPlanStore } from '@/store/generateWorkoutPlanStore';
import { Workout } from '@/services/interfaces';
import { generateBigNumberId } from '@/utils/helper';
import { WorkoutHistoryView } from './WorkoutHistoryView';
import useBreakPoints from '@/hooks/useBreakPoints';

function UpdateGeneratedWorkout(props: { toggleModal: () => void; workoutDetail: Workout }) {
  const { toggleModal, workoutDetail } = props;
  const isKeyboardVisible = useKeyboardVisibility();
  const { height } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);
  const { isExtraSmallDevice } = useBreakPoints();

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
    setWorkoutPlanHistoryList,
    workoutPlanHistoryList,
    handleUpdateWorkout,
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

  // Dynamic height calculation similar to InitializeChatBot
  const getDynamicHeight = useCallback(() => {
    if (isKeyboardVisible) {
      return isExtraSmallDevice ? height * 0.5 : height * 0.75;
    }
    return isExtraSmallDevice ? height * 0.9 - 50 : height * 0.9 - 50;
  }, [isKeyboardVisible, isExtraSmallDevice, height]);

  useEffect(() => {
    if (workoutDetail) {
      const historyPlan: any = {
        historyId: generateBigNumberId(),
        feedback: '',
        workoutPlan: workoutDetail,
      };

      setWorkoutPlanHistoryList([historyPlan]);
    }
  }, [workoutDetail]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          // keyboardVerticalOffset={0}
          style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            // contentContainerStyle={{ paddingBottom: 20 }}
            style={{
              height: getDynamicHeight(),
            }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }}>
            <>
              {workoutPlanHistoryList?.length > 0 && (
                <TouchableOpacity activeOpacity={1}>
                  <WorkoutHistoryView
                    workoutHistory={workoutPlanHistoryList}
                    toggleModal={toggleModal}
                    showSaveButton={isWorkoutApproved}
                    handleFeedback={handleFeedback}
                    handleRegenerateWorkout={handleRegenerateWorkout}
                    handleUpdateWorkout={handleUpdateWorkout}
                    isRegenerateWorkout={true}
                    errorMessage={responseError ?? ''}
                    isPendingGenerateWorkout={
                      isPendingRegenerateWorkout || isPendingUpdateGenerateWorkout
                    }
                  />
                </TouchableOpacity>
              )}
            </>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default UpdateGeneratedWorkout;
