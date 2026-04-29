"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);

    return (
      <div className="relative">
        <input
          {...props}
          className={cn(
            "flex h-11 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[var(--denim-400)] focus:ring-2 focus:ring-[var(--denim-200)]",
            className
          )}
          ref={ref}
          type={visible ? "text" : "password"}
        />
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
          onClick={() => setVisible((value) => !value)}
          type="button"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">{visible ? "Hide password" : "Show password"}</span>
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
