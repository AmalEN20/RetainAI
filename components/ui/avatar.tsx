import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <AvatarPrimitive.Root className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e1eee7] text-[#1b6045]", className)}>
      <AvatarPrimitive.Fallback className="text-xs font-bold text-current">{initials}</AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
