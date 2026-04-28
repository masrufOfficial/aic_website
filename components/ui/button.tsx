"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 ring-offset-slate-950",
  {
    variants: {
      variant: {
        default: "bg-[var(--denim-600)] text-white shadow-lg shadow-blue-950/15 hover:bg-[var(--denim-700)]",
        secondary: "bg-white/10 text-slate-100 ring-1 ring-white/15 backdrop-blur hover:bg-white/15",
        outline: "border border-[var(--denim-300)] bg-white/80 text-[var(--denim-800)] hover:bg-[var(--denim-50)]",
        ghost: "text-[var(--denim-100)] hover:bg-white/10 hover:text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
