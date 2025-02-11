import React from 'react';

import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { QuestionInput } from './QuestionInput';
import { questions } from './questions';
import { WorkoutPlanView } from './WorkoutPlan';
import { STRING_DATA } from '@/utils/appConstants';
import { useChatBot } from '@/hooks/useChatBot';

function InitializeChatBot(props: { toggleModal: () => void }) {
  const { toggleModal } = props;
  const {
    currentQuestionIndex,
    responses,
    workoutPlan,
    showSummary,
    responseError,
    isPendingGenerateWorkout,
    messagesEndRef,
    handleAnswer,
    handleContinue,
    getCurrentResponse,
    goBack,
    generateWorkout,
    saveWorkout,
  } = useChatBot(toggleModal);
  return (
    <div className=" overflow-y-auto bg-NAVBAR_BACKGROUND">
      <div className=" max-w-2xl ">
        <div className="rounded-xl border border-gray-800 bg-black p-4 sm:p-6">
          <div className="space-y-6">
            <ChatMessage isBot={true}>
              <p className="text-lg font-medium text-white">{STRING_DATA.BOT_DEFAULT_MESSAGE}</p>
            </ChatMessage>

            {responses.map((response, index) => (
              <React.Fragment key={index}>
                <ChatMessage isBot={true}>{questions[response.questionIndex].question}</ChatMessage>
                <ChatMessage isBot={false}>
                  {Array.isArray(response.answer) ? response.answer.join(', ') : response.answer}
                </ChatMessage>
              </React.Fragment>
            ))}

            {!workoutPlan && !showSummary && currentQuestionIndex < questions.length && (
              <>
                <ChatMessage isBot={true}>
                  <div className="flex items-center gap-2">
                    {currentQuestionIndex > 0 && (
                      <button
                        onClick={goBack}
                        className="rounded-full p-1 transition-colors hover:bg-gray-800">
                        <ArrowLeft className="h-5 w-5 text-white" />
                      </button>
                    )}
                    <span>{questions[currentQuestionIndex].question}</span>
                  </div>
                </ChatMessage>
                <div>
                  <QuestionInput
                    question={questions[currentQuestionIndex]}
                    value={getCurrentResponse()}
                    onChange={handleAnswer}
                    onSubmit={handleContinue}
                  />
                </div>
              </>
            )}

            {!workoutPlan && showSummary && (
              <>
                <ChatMessage isBot={true}>
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                      <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      Summary of Your Responses
                    </h3>
                    <div className="space-y-2">
                      {responses.map((response, index) => (
                        <div key={index} className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                          <div className="text-gray-400">
                            {questions[response.questionIndex].question}
                          </div>
                          <div className="font-medium text-white">
                            {Array.isArray(response.answer)
                              ? response.answer.join(', ')
                              : response.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-400">
                      Please review your answers above. Click "Generate Workout Plan" if you're
                      ready to proceed, or use the back button to make changes.
                    </p>
                  </div>
                </ChatMessage>
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

            {workoutPlan && (
              <ChatMessage isBot={true}>
                <WorkoutPlanView plan={workoutPlan} onSave={saveWorkout} />
              </ChatMessage>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InitializeChatBot;
