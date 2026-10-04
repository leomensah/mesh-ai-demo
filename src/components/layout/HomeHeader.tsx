import { Brand } from './Brand';
import { LanguageSelect } from './LanguageSelect';

export function HomeHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-x-5 gap-y-2.5 px-6 py-2.5">
        <Brand />
        <div className="flex-1" />
        <nav aria-label="TGHN" className="flex flex-wrap gap-x-4 gap-y-1 text-[15px]">
          <a href="https://mesh.tghn.org/mesh-ai/" target="_blank" rel="noopener" className="text-ink no-underline hover:underline">
            About
          </a>
          <a href="https://tghn.org/" target="_blank" rel="noopener" className="text-ink no-underline hover:underline">
            The Global Health Network
          </a>
        </nav>
        <LanguageSelect />
      </div>
    </header>
  );
}
