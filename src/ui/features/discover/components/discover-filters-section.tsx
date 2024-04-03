"use client";

import { Input } from "@/src/ui/components/shadcn/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { CreateCourseButton } from "../../courses/create/components/create-course-button";

export function DiscoverFiltersSection() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.trim() ?? "";
  const router = useRouter();

  const handleSearch = useDebouncedCallback((text: string) => {
    const query = text.trim();

    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
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
        onChange={(e) => handleSearch(e.target.value)}
      />
      <CreateCourseButton />
    </div>
  );
}
