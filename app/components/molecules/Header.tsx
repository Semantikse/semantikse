"use client";

import { FlammeCountIndicator } from "@/app/components/atoms/FlammeCountIndicator";
import { TimeLeftIndicator } from "@/app/components/atoms/TimeLeftIndicator";
import { WinnerCountIndicator } from "@/app/components/atoms/WinnerCountIndicator";
import { cn } from "@/app/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  flammeCount: number;
  remainingSeconds: number;
  winnerCount: number;
}
export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    { className, flammeCount, remainingSeconds, winnerCount, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "p-4 flex gap-6 w-full items-center justify-center font-newake",
          className,
        )}
        {...props}
        ref={ref}
      >
        <FlammeCountIndicator count={flammeCount} />

        <TimeLeftIndicator seconds={remainingSeconds} />

        <WinnerCountIndicator count={winnerCount} />
      </div>
    );
  },
);

Header.displayName = "Header";
