"use client";

import { cn } from "@/app/utils/cn";
import { forwardRef, InputHTMLAttributes } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 px-4 py-2 flex items-center",
          "rounded outline-2 -outline-offset-2 focus:ring ring-offset-2 focus:ring-orange-500",
          "font-medium text-base font-geist",
          "transition-colors -skew-x-10 ",
          "bg-orange-50 outline-orange-500 placeholder:text-orange-200 text-orange-900",
          "disabled:outline-orange-300",
          className,
        )}
        {...props}
      />
    );
  },
);

TextInput.displayName = "TextInput";
