"use client";

import { HourglassIcon } from "@/app/components/atoms/HourglassIcon";
import { cn } from "@/app/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface TimeLeftIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  seconds: number;
}
export const TimeLeftIndicator = forwardRef<
  HTMLDivElement,
  TimeLeftIndicatorProps
>(({ className, seconds, ...props }, ref) => {
  function formatSeconds(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");

    return `${h}:${mm}:${ss}`;
  }

  return (
    <div
      className={cn("flex gap-1 items-center", className)}
      {...props}
      ref={ref}
    >
      <HourglassIcon className="size-6 mb-0.5 text-orange-800" />
      {formatSeconds(seconds)}
    </div>
  );
});

TimeLeftIndicator.displayName = "TimeLeftIndicator";
