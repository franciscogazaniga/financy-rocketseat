import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[8px] text-sm font-light transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "px-3 py-3 h-fit bg-brand-base text-sm text-gray-100 font-normal hover:bg-brand-dark",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "bg-transparent hover:text-brand-dark",
        secondary:
          "px-3 py-3 h-fit bg-white text-title-primary font-normal border border-border hover:bg-gray-200",
        ghost: "bg-transparent hover:text-brand-base border-b border-transparent hover:border-brand-base",
        input: "px-3 bg-white border border-border rounded-[8px]",
        icon: "bg-transparent border border-transparent rounded-[8px] hover:border-border",
        link: "bg-transparent text-brand-base font-normal border-b border-transparent hover:border-brand-base",
      },
      size: {
        default: "",
        sm: "rounded-md text-xs",
        lg: "rounded-md",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
