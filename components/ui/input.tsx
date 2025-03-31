import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  error = false,
  fullWidth = true,
  ...props
}, ref) => {
  return (
    <input
      ref={ref}
      className={`
        px-3 py-2 rounded-md border bg-white text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className = '',
  error = false,
  fullWidth = true,
  ...props
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={`
        px-3 py-2 rounded-md border bg-white text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  error?: boolean;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className = '',
  error = false,
  fullWidth = true,
  options,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      className={`
        px-3 py-2 rounded-md border bg-white text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 
        ${error ? 'border-red-500' : 'border-gray-300'}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
});

Select.displayName = 'Select';

