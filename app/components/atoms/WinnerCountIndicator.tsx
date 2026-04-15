"use client";

import { cn } from "@/app/utils/cn";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import { HTMLAttributes, forwardRef } from "react";

interface WinnersCountIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  count: number;
}
export const WinnersCountIndicator = forwardRef<
  HTMLDivElement,
  WinnersCountIndicatorProps
>(({ className, count, ...props }, ref) => {
  const formattedCount = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <div
      className={cn("flex gap-1 items-center", className)}
      {...props}
      ref={ref}
    >
      <UserGroupIcon className="size-6 mb-0.5 text-orange-800" />
      {formattedCount}
    </div>
  );
});

WinnersCountIndicator.displayName = "WinnersCountIndicator";
