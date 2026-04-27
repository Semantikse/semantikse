"use client";

import { PrimaryButton } from "@/app/components/atoms/PrimaryButton";
import { SecondaryButton } from "@/app/components/atoms/SecondaryButton";
import { TertiaryButton } from "@/app/components/atoms/TertiaryButton";
import { TextInput } from "@/app/components/atoms/TextInput";
import { cn } from "@/app/utils/cn";
import {
  ArrowPathIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useRef,
  type SubmitEventHandler,
} from "react";

interface BottomBarProps extends HTMLAttributes<HTMLDivElement> {
  word: string;
  starsCount: number;
  canBuyHint: boolean;
  isSubmitting?: boolean;
  onChangeWord: (word: string) => void;
  onSubmitWord: VoidFunction;
  onOpenHintMarket: VoidFunction;
  errorMessage?: string;
  className?: string;
}
export const BottomBar = forwardRef<HTMLDivElement, BottomBarProps>(
  (
    {
      word,
      className,
      starsCount,
      canBuyHint,
      isSubmitting = false,
      onSubmitWord,
      onChangeWord,
      onOpenHintMarket,
      errorMessage,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmitForm: SubmitEventHandler<HTMLFormElement> = (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      onSubmitWord();
    };

    useEffect(() => {
      if (!isSubmitting) {
        inputRef.current?.focus();
      }
    }, [isSubmitting]);

    return (
      <div
        className={cn("flex flex-col gap-2 py-2", className)}
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
        {errorMessage && (
          <div className="text-red-500 text-sm font-medium px-2 animate-pulse">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmitForm} className="flex gap-1 items-center">
          <TextInput
            ref={inputRef}
            autoFocus
            value={word}
            onChange={(e) => onChangeWord(e.target.value)}
            className="w-full"
            placeholder="Text"
          />
          <PrimaryButton disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? (
              <ArrowPathIcon className="size-6 animate-spin" />
            ) : (
              <ArrowRightIcon className="size-6" />
            )}
          </PrimaryButton>
        </form>
      </div>
    );
  },
);

BottomBar.displayName = "BottomBar";
