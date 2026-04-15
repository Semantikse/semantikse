"use client";

import { cn } from "@/app/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}
export const SecondaryButton = forwardRef<
  HTMLButtonElement,
  SecondaryButtonProps
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "h-10 px-4 py-2 flex items-center",
        "rounded outline-2 -outline-offset-2 focus:ring ring-offset-2 focus:ring-orange-500",
        "font-medium text-base font-newake uppercase",
        "transition-colors -skew-x-10 ",
        "bg-orange-100 outline-orange-500  text-orange-500",
        "hover:outline-orange-400 hover:text-orange-400",
        "active:outline-orange-600 active:text-orange-600",
        "disabled:bg-orange-50 disabled:outline-orange-200 disabled:text-orange-200",
        className,
      )}
      {...props}
    />
  );
});

SecondaryButton.displayName = "SecondaryButton";
