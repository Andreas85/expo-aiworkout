import React from 'react';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { QuestionInput } from './QuestionInput';
import { questions } from './questions';
import { WorkoutPlanView } from './WorkoutPlan';
import { STRING_DATA } from '@/utils/appConstants';
import { useChatBot } from '@/hooks/useChatBot';
import { WorkoutFeedbackView } from './WorkoutFeedback.web';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const {
    currentQuestionId,
    responses,
    workoutPlan,
    responseError,
    isPendingGenerateWorkout,

    messagesEndRef,
    showFeedback,
    handleFeedback,
    isWorkoutApproved,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    saveWorkout,
  } = useChatBot(toggleModal);

  return (
    <div
      className={` ${isLargeScreen ? 'h-full max-h-full min-h-[80vh]' : 'max-h-[60vh]'} overflow-y-auto rounded-xl border border-gray-800 bg-black `}>
      <div className=" max-w-2xl ">
        <div className="p-4 sm:p-6">
          <div className=" space-y-6">
            <ChatMessage isBot={true}>
              <p className="text-lg font-medium text-white">{STRING_DATA.BOT_DEFAULT_MESSAGE}</p>
            </ChatMessage>

            {responses.map((response, index) => (
              <React.Fragment key={index}>
                <ChatMessage isBot={true}>{questions[response.questionId].question}</ChatMessage>

                <ChatMessage isBot={false}>
                  {Array.isArray(response.answer) ? response.answer.join(', ') : response.answer}
                </ChatMessage>
              </React.Fragment>
            ))}

            {/* Current question or workout generation */}
            {!workoutPlan && currentQuestionId !== 'end' && (
              <>
                <ChatMessage isBot={true}>
                  <div className="flex items-center gap-2">
                    {responses.length > 0 && (
                      <button
                        onClick={goBack}
                        className="rounded-full p-1 transition-colors hover:bg-blue-100">
                        <ArrowLeft className="h-5 w-5" />
                      </button>
                    )}
                    <span>{questions[currentQuestionId].question}</span>
                  </div>
                </ChatMessage>
                <div className="ml-11">
                  <QuestionInput
                    question={questions[currentQuestionId]}
                    value={getCurrentResponse()}
                    onChange={handleAnswer}
                    onSubmit={handleContinue}
                  />
                </div>
              </>
            )}

            {!workoutPlan && currentQuestionId === 'end' && (
              <>
                <div className="mt-6 flex flex-col justify-center">
                  {responseError && <div className="text-center text-red-500">{responseError}</div>}
                  <button
                    onClick={generateWorkout}
                    disabled={isPendingGenerateWorkout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-500 px-6 py-3 text-white transition-colors hover:bg-purple-600 disabled:opacity-50 sm:w-auto">
                    {isPendingGenerateWorkout ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating your workout plan...
                      </>
                    ) : (
                      'Generate Workout Plan'
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Workout plan and feedback */}
            {workoutPlan && (
              <>
                <ChatMessage isBot={true}>
                  <WorkoutPlanView
                    plan={workoutPlan}
                    onSave={saveWorkout}
                    showSaveButton={isWorkoutApproved}
                  />
                </ChatMessage>

                {showFeedback && !isWorkoutApproved && (
                  <ChatMessage isBot={true}>
                    <WorkoutFeedbackView onSubmit={handleFeedback} />
                  </ChatMessage>
                )}
              </>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitializeChatBot;
