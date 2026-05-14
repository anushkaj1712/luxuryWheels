import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,box-shadow,background] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-40 will-change-transform",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-zinc-100 via-white to-zinc-200 text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.35)] hover:shadow-[0_0_55px_-8px_rgba(255,255,255,0.55)] hover:-translate-y-0.5",
        ghost: "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/25",
        outline: "border border-white/20 text-white hover:bg-white/5",
        subtle: "bg-white/[0.03] text-white/90 hover:bg-white/[0.07]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { buttonVariants };
