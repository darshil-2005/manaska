import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    // ✅ CORRECT — this makes Link the real clickable element
    const Comp = asChild ? Slot : "button";

    // Add onClick for debugging
    const handleClick = (e) => {
      console.log('🔘 Button clicked!', { 
        asChild, 
        hasOnClick: !!props.onClick,
        href: props.href,
        tagName: e.currentTarget.tagName
      });
      
      // If this is a Link with asChild, don't prevent default
      if (asChild) {
        console.log('🔘 This should be a Link component');
        return; // Let the Link handle the navigation
      }
      
      // If it's a regular button with onClick, call it
      if (props.onClick) {
        props.onClick(e);
      }
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            outline:
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          }[variant],
          {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
          }[size],
          className
        )}
        {...props}
        onClick={handleClick}
      />
    );
  }
);

Button.displayName = "Button";