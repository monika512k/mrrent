'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className='flex flex-col gap-2'>
        {label && <label className='text-sm text-gray-400'>{label}</label>}
        <input
          ref={ref}
          className={twMerge(
            'w-full px-4 py-3 bg-[##121212] rounded-lg border border-gray-700',
            'text-white focus:outline-none focus:border-[#F5B544]',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input'; 