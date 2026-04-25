"use client";

import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export function ShopFilter() {
  const [name, setName] = useQueryState("name", {
    defaultValue: "",
    shallow: false,
    clearOnDefault: true,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setName(value);
  }, 500);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari kedai..."
        className="pl-8"
        defaultValue={name}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}
