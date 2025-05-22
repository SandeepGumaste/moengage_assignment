"use client";
import { useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { cn, getFilteredResponseCodeUrls } from "@/lib/utils";
import { Search } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";

export default function SearchBar() {
  const { query, setQuery, setResults } = useSearch();
  const debouncedQuery = useDebounce(query, 1000);

  useEffect(() => {
    if (debouncedQuery) {
      const filteredUrls = getFilteredResponseCodeUrls(debouncedQuery);
      setResults(filteredUrls);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, setResults]);

  const handleChange = (value: string) => {
    setQuery(value);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
      <Input
        type="text"
        placeholder="Search HTTP status codes (e.g. 2xx, 404, 20x)"
        value={query}
        onChange={e => handleChange(e.target.value)}
        className={cn(
          "pl-9 pr-4",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "border-2 hover:border-muted-foreground/50 focus-visible:border-primary"
        )}
        minLength={3}
        maxLength={3}
      />
    </div>
  );
}
