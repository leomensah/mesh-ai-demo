import { X } from 'lucide-react';

/** A removable filter: "Country: Kenya ×". */
export function FilterChip({ name, value, onRemove }: { name: string; value: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove filter ${name}: ${value}`}
      className="inline-flex min-h-[30px] items-center gap-[5px] rounded-full border border-tint-line bg-tint pl-2.5 pr-2 text-[13px] font-semibold text-primary-ink hover:bg-[#dcede5]"
    >
      <span className="font-normal text-[#4f6b60]">{name}:</span>
      {value}
      <X className="size-3" strokeWidth={2.8} aria-hidden="true" />
    </button>
  );
}
