import React, { useState } from 'react';

interface QuestionInputProps {
  question: { type: string; options?: readonly string[]; question: string };
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onSubmit: () => void;
}

export function QuestionInput({ question, value, onChange, onSubmit }: QuestionInputProps) {
  const [inputValue, setInputValue] = useState(typeof value === 'string' ? value : '');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleTextChange = (text: string) => {
    setInputValue(text);
  };

  switch (question.type) {
    case 'single-select':
      return (
        <div className="flex flex-col gap-2">
          {question.options?.map(option => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                onSubmit();
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                value === option
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option}
            </button>
          ))}
        </div>
      );

    case 'multi-select':
      return (
        <div className="flex flex-col gap-2">
          {question.options?.map(option => (
            <button
              key={option}
              onClick={() => {
                const currentValue = Array.isArray(value) ? value : [];
                const newValue = currentValue.includes(option)
                  ? currentValue.filter(v => v !== option)
                  : [...currentValue, option];
                onChange(newValue);
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                Array.isArray(value) && value.includes(option)
                  ? 'bg-NAVBAR_BACKGROUND text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option}
            </button>
          ))}
          <button
            onClick={onSubmit}
            className="mt-2 rounded-lg bg-purple-500 p-3 text-white transition-colors hover:bg-purple-600">
            Continue
          </button>
        </div>
      );

    case 'yes-no':
      return (
        <div className="flex gap-2">
          {['Yes', 'No'].map(option => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                onSubmit();
              }}
              className={`rounded-lg p-3 text-left transition-colors ${
                value === option
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}>
              {option}
            </button>
          ))}
        </div>
      );

    case 'text':
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={inputValue as string}
            onChange={e => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full resize-none rounded-lg border border-gray-700 bg-gray-900 p-3 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            rows={3}
            placeholder="Type your answer here..."
          />
          <button
            onClick={onSubmit}
            className="rounded-lg bg-purple-500 p-3 text-white transition-colors hover:bg-purple-600">
            Continue
          </button>
        </div>
      );

    default:
      return null;
  }
}
