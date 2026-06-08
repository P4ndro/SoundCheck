import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  containerClassName?: string;
}

export function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-subtle" />
      <Input type="search" className={cn("pl-9", className)} {...props} />
    </div>
  );
}
