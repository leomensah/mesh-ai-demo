import { Check, Undo2, X } from 'lucide-react';
import { toast } from 'sonner';

/*
  Shown after an edited question starts a new session. Sits just under the top bar, fades after
  8 seconds (paused while hovered), and "Back to previous" returns to the session you came from.
  Sonner's toast box is 356px wide, so the pill is centred inside it to stay centred on screen.
*/
function NewSessionToast({ id, onBack }: { id: string | number; onBack: () => void }) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex items-center gap-3 whitespace-nowrap rounded-xl bg-ink py-[9px] pl-3 pr-2 font-sans text-white shadow-[0_8px_24px_rgba(21,36,31,0.22),0_1px_3px_rgba(21,36,31,0.20)]">
        <span aria-hidden="true" className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-[#2e8b6e]">
          <Check className="size-3" strokeWidth={3} />
        </span>
        <span className="flex flex-col leading-[1.25]">
          <span className="text-sm font-semibold">New session started</span>
          <span className="text-[12.5px] text-[#b9c9c1]">No filters applied</span>
        </span>
        <button
          type="button"
          onClick={() => {
            toast.dismiss(id);
            onBack();
          }}
          className="ml-2 inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-white/10 px-2.5 text-[13px] font-semibold text-white hover:bg-white/20"
        >
          <Undo2 className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
          <span className="max-[480px]:hidden">Back to previous</span>
          <span className="hidden max-[480px]:inline">Back</span>
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => toast.dismiss(id)}
          className="flex size-[30px] items-center justify-center rounded-lg text-[#b9c9c1] hover:bg-white/10 hover:text-white"
        >
          <X className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export function showNewSessionToast(onBack: () => void) {
  toast.custom((id) => <NewSessionToast id={id} onBack={onBack} />, {
    id: 'new-session',
    position: 'top-center',
    duration: 8000
  });
}
