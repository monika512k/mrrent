'use client';

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  icon?: string;
  iconAlt?: string;
  showArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  isLoading,
  icon,
  iconAlt,
  showArrow = false,
  ...props
}) => {
  const baseStyles = 'py-3 rounded-lg transition-colors font-semibold disabled:opacity-50 relative  cursor-pointer';
  const variantStyles = {
    primary: 'bg-[#F5B544] text-black hover:bg-[#e5a93f]',
    secondary: 'bg-[#2C2C2C] border border-gray-700 text-white hover:border-[#F5B544]'
  };

  return (
    <button
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <Image src={icon} alt={iconAlt || ''} width={20} height={20} priority />}
        {isLoading ? 'Loading...' : (
          <>
            {children}
            {showArrow && (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path 
                  d="M4.16666 10H15.8333" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M10 4.16666L15.8333 10L10 15.8333" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </>
        )}
      </div>
    </button>
  );
}; 