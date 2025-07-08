import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onValueChange,
  placeholder = "Search…",
  className = "",
  ...props
}) => {
  return (
    <div className={cn("relative h-14 rounded-full", className)}>
      <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/80" />
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-full w-full !rounded-full !pl-11 !text-base tracking-wide"
        {...props}
      />
    </div>
  );
};
