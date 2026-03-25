import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-xl w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Search by title, author, or keyword..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-11 h-12 text-base bg-card border-border rounded-lg font-body"
      />
    </div>
  );
}
