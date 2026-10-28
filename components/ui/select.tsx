import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 py-2.5 text-sm font-medium text-slate-900",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-DEFAULT focus-visible:border-brand-DEFAULT",
            "hover:border-slate-300 transition-colors duration-150 cursor-pointer",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            !props.value && "text-slate-400",
            error && "border-red-400 focus-visible:ring-red-400",
            className
          )}
          ref={ref}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
