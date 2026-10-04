import { usingSampleData } from '@/api';

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-x-4 gap-y-2 px-6 py-4 text-sm text-muted">
        <span>
          Mesh-AI searches public content from The Global Health Network.
          {usingSampleData ? ' This is a clickable prototype with sample data.' : ''}
        </span>
        <a href="https://mesh.tghn.org/contact/" target="_blank" rel="noopener">
          Send feedback
        </a>
      </div>
    </footer>
  );
}
