"use client";

import { cn } from "@/app/utils/cn";
import { FireIcon } from "@heroicons/react/20/solid";
import { HTMLAttributes, forwardRef } from "react";

interface FlammesCountIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
}
export const FlammesCountIndicator = forwardRef<
  HTMLDivElement,
  FlammesCountIndicatorProps
>(({ className, count, ...props }, ref) => {
  return (
    <div
      className={cn("flex gap-1 items-center", className)}
      {...props}
      ref={ref}
    >
      <FireIcon className="size-6 mb-0.5 text-orange-800" />
      {count}
    </div>
  );
});

FlammesCountIndicator.displayName = "FlammesCountIndicator";
