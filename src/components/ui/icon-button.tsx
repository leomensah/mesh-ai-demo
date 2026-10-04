import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip } from './tooltip';

const base =
  'relative flex size-10 shrink-0 items-center justify-center rounded-[10px] border no-underline transition-colors max-[640px]:size-[38px]';
const tone = (active?: boolean) =>
  active
    ? 'border-tint-line bg-tint text-primary-ink hover:text-primary-ink'
    : 'border-field bg-surface text-ink-2 hover:bg-[#f7f9f8] hover:text-ink';

interface Common {
  label: string;
  tooltip?: string;
  active?: boolean;
  badge?: number;
  children: ReactNode;
}

function Badge({ n }: { n?: number }) {
  if (!n) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-primary px-[5px] text-[11px] font-bold leading-none text-white"
    >
      {n}
    </span>
  );
}

export function IconButton({ label, tooltip, active, badge, children, onClick, ...rest }: Common & { onClick: () => void; 'aria-haspopup'?: 'dialog' }) {
  return (
    <Tooltip label={tooltip ?? label}>
      <button type="button" aria-label={label} onClick={onClick} className={cn(base, tone(active))} {...rest}>
        {children}
        <Badge n={badge} />
      </button>
    </Tooltip>
  );
}

export function IconLink({ label, tooltip, active, children, to, current }: Common & { to: string; current?: boolean }) {
  return (
    <Tooltip label={tooltip ?? label}>
      <Link to={to} aria-label={label} aria-current={current ? 'page' : undefined} className={cn(base, tone(active))}>
        {children}
      </Link>
    </Tooltip>
  );
}
