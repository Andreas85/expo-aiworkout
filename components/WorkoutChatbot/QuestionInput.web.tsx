import { Question } from '@/types';
import React, { useState } from 'react';

interface QuestionInputProps {
  question: Question;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onSubmit: () => void;
}

export function QuestionInput({ question, value, onChange, onSubmit }: QuestionInputProps) {
  const [tempValue, setTempValue] = useState<string | string[]>(value);
  // console.log('QuestionInput', { question, value });
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onChange(tempValue);
      onSubmit();
    }
  };

  const handleSubmit = () => {
    onChange(tempValue);
    onSubmit();
  };

  switch (question.type) {
    case 'single-select':
      return (
        <div className="flex flex-col gap-2">
          {question.options?.map(option => (
            <button
              key={option.label}
              onClick={() => {
                onChange(option.label);
                onSubmit();
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                value === option.label
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      );

    case 'multi-select':
      return (
        <div className="flex flex-col gap-2">
          {question.options?.map(option => (
            <button
              key={option.label}
              onClick={() => {
                const currentValue = Array.isArray(tempValue) ? tempValue : [];
                const newValue = currentValue.includes(option.label)
                  ? currentValue.filter(v => v !== option.label)
                  : [...currentValue, option.label];
                setTempValue(newValue);
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                Array.isArray(tempValue) && tempValue.includes(option.label)
                  ? 'bg-purple-300 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option.label}
            </button>
          ))}
          <button
            onClick={handleSubmit}
            className="mt-2 rounded-lg bg-purple-500 p-3 text-white transition-colors hover:bg-purple-600">
            Continue
          </button>
        </div>
      );

    case 'yes-no':
      return (
        <div className="flex gap-2">
          {question.options?.map(option => (
            <button
              key={option.label}
              onClick={() => {
                onChange(option.label);
                onSubmit();
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                value === option.label
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option.label}
            </button>
          ))}
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={tempValue as string}
            onChange={e => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 p-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            rows={3}
            placeholder="Type your answer here..."
          />
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-purple-500 p-3 text-white transition-colors hover:bg-purple-600">
            Continue
          </button>
        </div>
      );

    default:
      return null;
  }
}
