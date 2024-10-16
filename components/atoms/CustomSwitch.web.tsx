import React from 'react';
import { ICustomSwitch } from '@/utils/interfaces';
import useWebBreakPoints from '@/hooks/useWebBreakPoints';

const CustomSwitch = (props: ICustomSwitch) => {
  const {
    isEnabled,
    toggleSwitch,
    label,
    hasRightLabel,
    labelRight,
    labelStyle,
    containerWebStyle,
  } = props;
  const { isLargeScreen } = useWebBreakPoints();
  const handleRightLabel = () => {
    if (hasRightLabel) {
      return (
        <span
          className={
            `${isLargeScreen ? 'text-[0.875rem]' : 'text-[1rem]'}  font-medium text-gray-300 ` +
            labelStyle
          }>
          {labelRight}
        </span>
      );
    }
  };
  return (
    <label
      className={`my-4 flex cursor-pointer items-center justify-end gap-2 ` + containerWebStyle}>
      <span
        className={
          ` ${isLargeScreen ? 'text-[0.875rem]' : 'ms-3 text-[1rem]'}  font-medium text-gray-300 ` +
          labelStyle
        }>
        {label}
      </span>
      <input type="checkbox" checked={isEnabled} onChange={toggleSwitch} className="peer sr-only" />
      <div
        className={`relative h-6 w-11 rounded-full border-gray-600 
          after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5
          after:rounded-full after:border after:border-gray-300 after:bg-white
          after:transition-all after:content-['']
          ${isEnabled ? 'bg-WORKOUT_PURPLE  after:translate-x-full after:border-white' : 'bg-gray-700'}
          rtl:${isEnabled ? 'after:-translate-x-full' : ''}
        `}></div>

      {handleRightLabel()}
    </label>
  );
};

export default CustomSwitch;
