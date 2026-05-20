import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-light text-brand-dark border border-brand-200",
        secondary: "bg-slate-100 text-slate-700",
        destructive: "bg-red-50 text-red-700 border border-red-100",
        outline: "border border-current bg-transparent",
        success: "bg-green-50 text-green-700 border border-green-100",
        warning: "bg-amber-50 text-amber-700 border border-amber-100",
        info: "bg-blue-50 text-blue-700 border border-blue-100",
        purple: "bg-violet-50 text-violet-700 border border-violet-100",
        dark: "bg-slate-900 text-white",
        glass: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
