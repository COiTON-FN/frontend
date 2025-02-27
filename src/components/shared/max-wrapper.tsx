import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const MaxWrapper = forwardRef<HTMLElement, React.ComponentProps<"section">>(
  ({ children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("mx-auto w-full max-w-[1510px] px-5 md:px-6", className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

MaxWrapper.displayName = "MaxWrapper";

export default MaxWrapper;
