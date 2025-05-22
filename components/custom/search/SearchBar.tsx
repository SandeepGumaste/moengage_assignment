"use client";
import React, { useEffect, useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { cn, getFilteredResponseCodeUrls } from "@/lib/utils";
import { Search, Save } from "lucide-react";
import { useSearch } from "@/contexts/SearchContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const SearchBar = () => {
  const { query, setQuery, results, setResults } = useSearch();
  const { user } = useUser();
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 1000);
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = useCallback(() => {
    if (debouncedQuery) {
      const filteredUrls = getFilteredResponseCodeUrls(debouncedQuery);
      setResults(filteredUrls);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, setResults]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
    },
    [setQuery]
  );

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/");
        return;
      }

      const cleanToken = token.replace(/^Bearer\s+/i, '');

      const requestData = {
        name: query,
        email: user?.email || '',
        responseCodes: results.map(r => r.code),
        imageUrls: results.map(r => r.url)
      };
      
      const saveResponse = await fetch("/api/saved-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanToken}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await saveResponse.json();

      if (!saveResponse.ok) {
        if (saveResponse.status === 401) {
          localStorage.removeItem("authToken");
          router.push("/");
          return;
        }
        if (saveResponse.status === 409) {
          throw new Error("A list with this name already exists.");
        }
        throw new Error(data.message || "Failed to save list");
      }

      alert("List saved successfully!");
    } catch (error) {
      console.error("Error saving list:", error);
      alert(error instanceof Error ? error.message : "Failed to save list");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex gap-2">
      <div className="relative flex-1">
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
      <Button
        onClick={handleSave}
        disabled={results.length === 0 || isSaving}
        variant="outline"
        size="default"
        className="flex-shrink-0"
        title="Save current results"
      >
        <Save className={cn("h-4 w-4", isSaving && "animate-pulse")} />
        Save
      </Button>
    </div>
  );
};

export default React.memo(SearchBar);
