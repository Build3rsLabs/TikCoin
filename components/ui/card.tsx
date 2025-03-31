import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return <div className={`font-semibold text-lg mb-3 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return <div className={`${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return <div className={`mt-4 pt-3 border-t ${className}`}>{children}</div>;
};

