import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border dark:bg-[#0A0A0A] bg-white text-secondary-foreground hover:bg-secondary/80",
        pending:
          "border-[#FFF552] bg-[#FFF552]/[0.1] text-[#FFF552] hover:bg-secondary/80",
        lemon:
          "text-[#FFF552] px-0",
        blue:
        "border-[#00A3FF] bg-[#00A3FF]/[0.1] text-[#00A3FF]",
        destructive:
          "border-transparent bg-destructive text-black hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-[#2EB88A] bg-[#2EB88A]/[0.1] text-[#2EB88A]",
        warning: "border-destructive bg-destructive/[0.2] text-destructive",
        onhold: "border-[#A3A3A3] bg-[#A3A3A3]/[0.2] text-[#A3A3A3]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };