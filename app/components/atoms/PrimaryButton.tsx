"use client";

import { cn } from "@/app/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "h-10 px-4 py-2 flex gap-1 items-center",
          "rounded outline-none focus:ring focus:ring-offset-2 focus:ring-orange-500",
          "font-medium text-base font-newake uppercase",
          "transition-colors -skew-x-10",
          "bg-orange-500 outline-orange-500 text-orange-50",
          "hover:bg-orange-400",
          "active:bg-orange-600",
          "disabled:bg-orange-300 disabled:text-orange-100",
          className,
        )}
        {...props}
      />
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";
