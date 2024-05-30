"use client";

import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Input } from "@/src/common/ui/components/shadcn/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

export function DiscoverFiltersSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("query")?.trim() ?? "";

  const inputValueRef = useRef(query);

  const handleSearch = useDebouncedCallback(() => {
    const newQuery = inputValueRef.current.trim();

    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set("query", newQuery);
    } else {
      params.delete("query");
    }

    if (query === newQuery) {
      const retries = parseInt(searchParams.get("retries") ?? "") || 0;
      params.set("retries", `${retries + 1}`);
    } else {
      params.delete("retries");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex space-x-4">
      <Input
        type="search"
        name="search"
        placeholder="Buscar cursos"
        className="flex-1"
        defaultValue={query}
        onChange={(e) => {
          inputValueRef.current = e.target.value;
          handleSearch();
        }}
      />
      <Button variant="secondary" size="icon" onClick={handleSearch}>
        <span className="sr-only">Buscar</span>
        <Search className="text-muted-foreground" />
      </Button>
    </div>
  );
}
