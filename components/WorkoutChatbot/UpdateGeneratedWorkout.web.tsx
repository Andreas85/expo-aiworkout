import React from 'react';

import { ChatMessage } from './ChatMessage';
import { WorkoutPlanView } from './WorkoutPlan';
import { useChatBot } from '@/hooks/useChatBot';
import { WorkoutFeedbackView } from './WorkoutFeedback.web';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { useGenerateWorkoutPlanStore } from '@/store/generateWorkoutPlanStore';

function UpdateGeneratedWorkout(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const {
    messagesEndRef,
    handleFeedback,
    isWorkoutApproved,
    handleRegenerateWorkout,
    isPendingRegenerateWorkout,
    isPendingUpdateGenerateWorkout,
    responseError,
  } = useChatBot(toggleModal);
  const generatedWorkoutPlan = useGenerateWorkoutPlanStore(state => state.generatedWorkoutPlan);

  return (
    <div
      className={` ${isLargeScreen ? 'h-full max-h-full min-h-[80vh]' : 'max-h-[60vh]'} overflow-y-auto rounded-xl border border-gray-800 bg-black `}>
      <div className=" max-w-2xl ">
        <div className="p-4 sm:p-6">
          <div className=" space-y-6">
            <ChatMessage isBot={true}>
              <WorkoutPlanView
                plan={{
                  name: generatedWorkoutPlan?.name,
                  exercises: generatedWorkoutPlan?.exercises || [],
                }}
                showSaveButton={isWorkoutApproved}
                toggleModal={toggleModal}
              />
            </ChatMessage>
            <ChatMessage isBot={true}>
              <WorkoutFeedbackView
                onSubmit={handleFeedback}
                onSubmitRegenerate={handleRegenerateWorkout}
                isEditGeneratedWorkout={true}
                errorMessage={responseError ?? ''}
                isEditLoading={isPendingRegenerateWorkout || isPendingUpdateGenerateWorkout}
              />
            </ChatMessage>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGeneratedWorkout;
