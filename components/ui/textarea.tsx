import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900",
            "placeholder:text-slate-400 placeholder:font-normal",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-DEFAULT focus-visible:border-brand-DEFAULT",
            "hover:border-slate-300 transition-colors duration-150 resize-y",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            error && "border-red-400 focus-visible:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
