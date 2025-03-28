import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { WorkoutFeedback } from '@/types';
import { ActivityIndicator } from 'react-native';

interface WorkoutFeedbackProps {
  isEditGeneratedWorkout?: boolean;
  isEditLoading?: boolean;
  onSubmit: (feedback: WorkoutFeedback) => void;
  onSubmitRegenerate?: (data: string) => void;
  errorMessage?: string;
}

export function WorkoutFeedbackView({
  onSubmit,
  isEditGeneratedWorkout = false,
  isEditLoading = false,
  onSubmitRegenerate,
  errorMessage = '',
}: WorkoutFeedbackProps) {
  const [feedback, setFeedback] = useState<string>('');
  const [showTextArea, setShowTextArea] = useState(false);

  const handleSubmit = () => {
    if (isEditGeneratedWorkout) {
      console.log('Feedback:342Web', feedback);
      onSubmitRegenerate?.(feedback);
      return;
    }
    onSubmit({ rating: 'needs_changes', feedback });
  };

  const renderContainer = () => {
    if (isEditGeneratedWorkout) {
      return (
        <div className="w-full min-w-[300px] space-y-3">
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Please tell us what you'd like to change..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            rows={3}
          />
          {errorMessage && <div className="text-center text-red-500">{errorMessage}</div>}
          <button
            onClick={handleSubmit}
            disabled={!feedback || isEditLoading}
            className={`min-h-12 w-full min-w-[150px] rounded-lg p-3 ${!feedback || isEditLoading ? 'cursor-not-allowed bg-blue-300 text-white' : ' bg-blue-600  text-white'} transition-colors `}>
            {isEditLoading ? <ActivityIndicator /> : 'Submit Feedback'}
          </button>
        </div>
      );
    }

    return (
      <>
        <h3 className="mb-4 text-lg font-semibold">How's this workout plan?</h3>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSubmit({ rating: 'good' })}
            className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200">
            <ThumbsUp className="h-5 w-5" />
            Looks Good!
          </button>
          <button
            onClick={() => setShowTextArea(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200">
            <ThumbsDown className="h-5 w-5" />
            Needs Changes
          </button>
        </div>

        {showTextArea && (
          <div className="space-y-3">
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Please tell us what you'd like to change..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className={`w-full rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 `}>
              Submit Feedback
            </button>
          </div>
        )}
      </>
    );
  };

  return <div className="space-y-4">{renderContainer()}</div>;
}
