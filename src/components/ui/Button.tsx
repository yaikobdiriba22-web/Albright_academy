import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 shadow-sm',
  };

  const variantClasses = {
    primary:
      'bg-[#0f2444] text-white hover:bg-[#16345f] active:bg-[#0a182e] focus:ring-[#0f2444]',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400',
    gold:
      'bg-amber-500 text-slate-950 font-semibold hover:bg-amber-400 active:bg-amber-600 focus:ring-amber-500 shadow-sm',
    outline:
      'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 focus:ring-slate-400',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : icon}
      <span>{children}</span>
    </button>
  );
};
