import React from 'react';
import { ICustomSwitch } from '@/utils/interfaces';

const CustomSwitch = (props: ICustomSwitch) => {
  const { isEnabled, toggleSwitch, label } = props;
  return (
    <label className="mb-2 flex cursor-pointer items-center justify-end gap-2">
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>
      <input type="checkbox" checked={isEnabled} onChange={toggleSwitch} className="peer sr-only" />
      <div
        className={`relative h-6 w-11 rounded-full border-gray-600 
          after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5
          after:rounded-full after:border after:border-gray-300 after:bg-white
          after:transition-all after:content-['']
          ${isEnabled ? 'bg-WORKOUT_PURPLE  after:translate-x-full after:border-white' : 'bg-gray-700'}
          rtl:${isEnabled ? 'after:-translate-x-full' : ''}
        `}></div>
    </label>
  );
};

export default CustomSwitch;
