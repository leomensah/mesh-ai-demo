import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

export function Checkbox(props: CheckboxPrimitive.CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      className="flex size-[17px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] border-[#8fa098] bg-white data-[state=checked]:border-primary data-[state=checked]:bg-primary"
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3 text-white" strokeWidth={3.2} aria-hidden="true" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
