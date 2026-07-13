import * as React from "react";
import { cn } from "@/lib/utils";

const styles = {
  high: "bg-[#fff0ed] text-[#a43d2f] ring-[#f4cfc8]",
  medium: "bg-[#fff6dd] text-[#946c13] ring-[#efdfa9]",
  low: "bg-[#e8f7ef] text-[#177553] ring-[#c6ead6]",
  neutral: "bg-[#f0f2ee] text-[#5f6962] ring-[#dfe3dd]",
  blue: "bg-[#ebf2ff] text-[#3866a9] ring-[#d1def5]",
};

export function Badge({ className, tone = "neutral", ...props }: React.HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof styles }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold leading-none ring-1 ring-inset", styles[tone], className)} {...props} />;
}
