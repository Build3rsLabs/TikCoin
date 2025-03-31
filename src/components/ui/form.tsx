import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({ 
  children, 
  onSubmit,
  className = '',
  ...props 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      {children}
    </form>
  );
};

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  className = '',
  required = false,
  children
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const FormGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return <div className={`flex flex-col space-y-4 ${className}`}>{children}</div>;
};

export const FormActions: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return <div className={`mt-6 flex items-center justify-end space-x-3 ${className}`}>{children}</div>;
};

