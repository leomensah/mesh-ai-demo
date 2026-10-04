import { Link } from 'react-router';

export function Brand() {
  return (
    <Link to="/" className="flex min-h-10 items-center gap-2 whitespace-nowrap text-ink no-underline hover:text-ink">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="6" cy="7" r="2.5" />
          <circle cx="18" cy="7" r="2.5" />
          <circle cx="12" cy="18" r="2.5" />
          <path d="M8.5 7h7M7.2 9.2l3.6 6.6M16.8 9.2l-3.6 6.6" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-[-0.01em]">Mesh-AI</span>
    </Link>
  );
}
