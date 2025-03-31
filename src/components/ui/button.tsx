import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-200 hover:bg-gray-300 text-gray-800';
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-100 text-gray-800';
      case 'ghost':
        return 'hover:bg-gray-100 text-gray-800';
      case 'link':
        return 'text-blue-600 hover:underline p-0';
      case 'destructive':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'text-sm px-3 py-1';
      case 'md':
        return 'text-base px-4 py-2';
      case 'lg':
        return 'text-lg px-6 py-3';
      default:
        return 'text-base px-4 py-2';
    }
  };

  const classes = [
    'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
    getVariantClasses(),
    getSizeClasses(),
    fullWidth ? 'w-full' : '',
    (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].join(' ').trim();

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block animate-spin">⟳</span>
      )}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

