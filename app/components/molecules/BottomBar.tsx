"use client";

import { PrimaryButton } from "@/app/components/atoms/PrimaryButton";
import { SecondaryButton } from "@/app/components/atoms/SecondaryButton";
import { TertiaryButton } from "@/app/components/atoms/TertiaryButton";
import { TextInput } from "@/app/components/atoms/TextInput";
import { cn } from "@/app/utils/cn";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/20/solid";
import { HTMLAttributes, forwardRef } from "react";

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {
  word: string;
  starsCount: number;
  canBuyHint: boolean;
  onChangeWord: (word: string) => void;
  onSendWord: VoidFunction;
  onOpenHintMarket: VoidFunction;
  className?: string;
}
export const BottomBar = forwardRef<HTMLDivElement, BottomBarProps>(
  (
    {
      className,
      starsCount,
      canBuyHint,
      onSendWord,
      onChangeWord,
      onOpenHintMarket,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn("flex flex-col gap-2", className)}
        {...props}
        ref={ref}
      >
        <div className="ms-auto w-fit relative grid grid-cols-2">
          <TertiaryButton
            onClick={onOpenHintMarket}
            className="shadow-md absolute inset-0"
          >
            {starsCount}
            <StarIcon className="size-4 mb-0.5" />
          </TertiaryButton>
          {canBuyHint ? (
            <PrimaryButton
              onClick={onOpenHintMarket}
              className="w-max col-start-2 col-end-2"
            >
              Indices
            </PrimaryButton>
          ) : (
            <SecondaryButton
              onClick={onOpenHintMarket}
              className="w-max col-start-2 col-end-2"
            >
              Indices
            </SecondaryButton>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <TextInput
            onChange={(e) => onChangeWord(e.target.value)}
            className="w-full"
            placeholder="Text"
          />
          <PrimaryButton onClick={onSendWord}>
            <ArrowRightIcon className="size-6" />
          </PrimaryButton>
        </div>
      </div>
    );
  },
);

BottomBar.displayName = "BottomBar";
