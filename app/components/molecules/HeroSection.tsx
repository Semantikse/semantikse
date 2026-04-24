"use client";

import { HourglassIcon } from "@/app/components/atoms/HourglassIcon";
import { cn } from "@/app/utils/cn";
import { formatHoursMinutesSeconds, formatThousands } from "@/app/utils/format";
import { FireIcon, UserGroupIcon } from "@heroicons/react/20/solid";
import { HTMLAttributes, forwardRef } from "react";

interface HeroSectionProps extends HTMLAttributes<HTMLDivElement> {
  flammeCount: number;
  remainingSeconds: number;
  winnerCount: number;
}
export const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    { className, flammeCount, remainingSeconds, winnerCount, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "pt-6 inline-flex flex-col justify-start items-start gap-5",
          className,
        )}
        {...props}
        ref={ref}
      >
        <div className="self-stretch justify-start  text-6xl font-normal font-newake leading-6">
          Semantikse
        </div>
        <div className="self-stretch justify-start  text-2xl font-normal font-newake leading-6 tracking-wide">
          Trouvez le mot du jour
        </div>

        <div className="flex flex-col gap-2 font-geist text-orange-950">
          <div className="flex gap-1 items-center">
            <FireIcon className="size-6 mb-0.5 text-orange-800" />
            {flammeCount} victoire{flammeCount > 1 ? "s" : ""} de suite
          </div>

          <div className="flex gap-1 items-center">
            <HourglassIcon className="size-6 mb-0.5 text-orange-800" />
            {formatHoursMinutesSeconds(remainingSeconds)} avant le prochain mot
          </div>

          <div className="flex gap-1 items-center">
            <UserGroupIcon className="size-6 mb-0.5 text-orange-800" />
            {formatThousands(winnerCount)} ont trouvé le mot
          </div>
        </div>
      </div>
    );
  },
);

HeroSection.displayName = "HeroSection";
