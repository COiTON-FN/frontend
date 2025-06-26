import * as React from "react";
import { motion, MotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap cursor-pointer rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        black: "bg-black text-primary-foreground hover:bg-black/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent text-muted-foreground hover:text-primary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-primary hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-10 rounded-md px-4",
        lg: "h-14 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      keyof MotionProps
    >,
    MotionProps,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  txt?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, txt, children, className, variant, size, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 700, damping: 25 }}
        className={cn("gap-2", buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            {txt}
          </>
        ) : (
          (children as React.ReactNode)
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
