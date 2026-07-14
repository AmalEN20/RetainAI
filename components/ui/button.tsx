import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#177553]/30 disabled:pointer-events-none disabled:opacity-50 sm:min-h-0",
  {
    variants: {
      variant: {
        default: "bg-[#177553] text-white hover:bg-[#126443] shadow-sm",
        outline: "border bg-white text-[#27312b] hover:bg-[#f3f5f1]",
        ghost: "text-[#536058] hover:bg-[#edf0eb] hover:text-[#18211d]",
        danger: "bg-[#fff0ed] text-[#a43d2f] hover:bg-[#f9dfda]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-11 px-3 text-xs sm:h-8",
        icon: "h-11 w-11 sm:h-10 sm:w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
