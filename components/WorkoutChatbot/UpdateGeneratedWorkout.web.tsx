import React, { useEffect } from 'react';

import { useChatBot } from '@/hooks/useChatBot';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';
import { WorkoutHistoryView } from './WorkoutHistoryView';
import { Workout } from '@/services/interfaces';
import { generateBigNumberId } from '@/utils/helper';

function UpdateGeneratedWorkout(props: { toggleModal: () => void; workoutDetail: Workout }) {
  const { toggleModal, workoutDetail } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const {
    messagesEndRef,
    handleRegenerateWorkout,
    isWorkoutApproved,
    setWorkoutPlanHistoryList,
    isPendingRegenerateWorkout,
    isPendingUpdateGenerateWorkout,
    workoutPlanHistoryList,
    responseError,
    handleFeedback,
    handleUpdateWorkout,
  } = useChatBot(toggleModal);

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
    <div
      className={` ${isLargeScreen ? 'h-full max-h-full min-h-[80vh]' : 'max-h-[60vh]'} overflow-y-auto rounded-xl border border-gray-800 bg-black `}>
      <div className="">
        <div className="p-4 sm:p-6">
          <div className=" space-y-6">
            {workoutPlanHistoryList?.length > 0 && (
              <>
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
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateGeneratedWorkout;
