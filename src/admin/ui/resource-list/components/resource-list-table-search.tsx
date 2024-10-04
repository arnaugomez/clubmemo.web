import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { Input } from "@/src/common/ui/components/shadcn/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { translateAdminKey } from "../../i18n/admin-translations";

interface ResourceListTableFiltersProps {
  resourceType: AdminResourceTypeModel;
}
export function ResourceListTableSearch({
  resourceType,
}: ResourceListTableFiltersProps) {
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
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      type="search"
      name="search"
      placeholder={`Buscar ${translateAdminKey(resourceType, "plural")}`}
      className="flex-1"
      defaultValue={query}
      onChange={(e) => {
        inputValueRef.current = e.target.value;
        handleSearch();
      }}
    />
  );
}