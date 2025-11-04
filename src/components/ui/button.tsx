import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-pink-400 to-pink-600 text-white hover:shadow-pink-200/50 transform hover:scale-105 transition-all duration-300 shadow-lg",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:shadow-purple-200/50 transform hover:scale-105 transition-all duration-300 shadow-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        romantic: "bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 text-white hover:shadow-rose-200/50 transform hover:scale-105 transition-all duration-300 shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-full",
        sm: "h-9 px-4 py-2 rounded-full",
        lg: "h-14 px-8 py-4 rounded-full",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    // Button click sound effect (debounced)
    const lastClickRef = React.useRef<number>(0);
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (typeof props.onClick === "function") props.onClick(e);
      const now = Date.now();
      if (now - lastClickRef.current < 50) return; // debounce 50ms
      lastClickRef.current = now;
      try {
        const audio = new Audio("/button-click.mp3");
        audio.volume = 0.5;
        audio.play().catch(() => {});
      } catch {}
    };
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} onClick={handleClick} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
