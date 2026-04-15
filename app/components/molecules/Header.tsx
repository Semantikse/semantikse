"use client";

import { FlammesCountIndicator } from "@/app/components/atoms/FlammesCountIndicator";
import { TimeLeftIndicator } from "@/app/components/atoms/TimeLeftIndicator";
import { WinnersCountIndicator } from "@/app/components/atoms/WinnerCountIndicator";
import { cn } from "@/app/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  flammesCount: number;
  remainingSeconds: number;
  winnersCount: number;
}
export const Header = forwardRef<HTMLDivElement, HeaderProps>(
  (
    { className, flammesCount, remainingSeconds, winnersCount, ...props },
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
        <FlammesCountIndicator count={flammesCount} />

        <TimeLeftIndicator seconds={remainingSeconds} />

        <WinnersCountIndicator count={winnersCount} />
      </div>
    );
  },
);

Header.displayName = "Header";
