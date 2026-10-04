import { cva, type VariantProps } from 'class-variance-authority';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-[10px] text-sm font-semibold no-underline transition-colors disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary-hover hover:text-white',
        secondary: 'border border-field bg-surface text-ink hover:bg-[#f7f9f8] hover:text-ink',
        link: 'rounded-none px-1 font-semibold text-primary underline underline-offset-[3px] hover:text-primary-hover',
        danger: 'rounded-none px-1 font-semibold text-danger underline underline-offset-[3px]'
      },
      size: {
        md: 'min-h-10 px-[18px]',
        lg: 'min-h-[46px] px-7 text-[15px]',
        sm: 'min-h-[34px] px-3 text-[13px] rounded-lg',
        inline: 'min-h-[30px] text-[13px]'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
