"use client";

import { cn } from "@/app/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface TertiaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const TertiaryButton = forwardRef<
  HTMLButtonElement,
  TertiaryButtonProps
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "h-10 px-4 py-2 flex items-center",
        "rounded outline-2 -outline-offset-2 focus:ring ring-offset-2 focus:ring-orange-500",
        "font-medium text-base font-newake uppercase",
        "transition-colors -skew-x-10 ",
        "bg-orange-50 outline-orange-200  text-orange-500",
        "hover:outline-orange-100 hover:text-orange-400",
        "active:outline-orange-300 active:text-orange-600",
        "disabled:bg-orange-50 disabled:outline-orange-200 disabled:text-orange-200",
        className,
      )}
      {...props}
    />
  );
});

TertiaryButton.displayName = "TertiaryButton";
