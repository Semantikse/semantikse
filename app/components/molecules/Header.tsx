"use client";

import { HourglassIcon } from "@/app/components/atoms/HourglassIcon";
import { cn } from "@/app/utils/cn";
import { formatHoursMinutesSeconds, formatThousands } from "@/app/utils/format";
import { FireIcon, UserGroupIcon } from "@heroicons/react/20/solid";
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
          "p-4 flex gap-6 w-full items-center justify-center",
          className,
        )}
        {...props}
        ref={ref}
      >
        <div className="flex gap-1 items-center font-newake">
          <FireIcon className="size-6 mb-0.5 text-orange-800" />
          {flammeCount}
        </div>

        <div className="flex gap-1 items-center font-newake">
          <HourglassIcon className="size-6 mb-0.5 text-orange-800" />
          {formatHoursMinutesSeconds(remainingSeconds)}
        </div>

        <div className="flex gap-1 items-center font-newake">
          <UserGroupIcon className="size-6 mb-0.5 text-orange-800" />
          {formatThousands(winnerCount)}
        </div>
      </div>
    );
  },
);

Header.displayName = "Header";
