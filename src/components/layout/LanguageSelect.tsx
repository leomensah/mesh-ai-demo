import { useId } from 'react';
import { cn } from '@/lib/utils';

export function LanguageSelect({ className }: { className?: string }) {
  const id = useId();
  return (
    <>
      <label htmlFor={id} className="sr-only">
        Language
      </label>
      <select id={id} className={cn('min-h-9 rounded-lg border border-field bg-surface px-2 text-sm', className)} defaultValue="English">
        <option>English</option>
        <option>Español</option>
        <option>Português</option>
        <option>Français</option>
      </select>
    </>
  );
}
