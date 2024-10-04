import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { cn } from "@/src/common/ui/utils/shadcn";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { translateAdminKey } from "../../i18n/admin-translations";
import { ResourceListFiltersForm } from "./resource-list-filters-form";
import { ResourceListTableSearch } from "./resource-list-table-search";
import { ShowColumnsDropdown } from "./show-columns-dropdown";

interface ResourceListTableFiltersProps {
  resource: AdminResourceModel;
  fieldNames: string[];
  setVisibleColumns: (fieldNames: string[]) => void;
  visibleColumns: string[];
}
export function ResourceListTableFilters({
  visibleColumns,
  fieldNames,
  resource,
  setVisibleColumns,
}: ResourceListTableFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <div className="space-y-2 sm:flex sm:space-x-4 sm:space-y-0">
        <ResourceListTableSearch resourceType={resource.resourceType} />
        <div className="flex flex-none space-x-4">
          <Button
            className={cn(
              "w-32 flex-1 sm:flex-none",
              showFilters && "border-[1px] border-slate-300",
            )}
            variant={showFilters ? "secondary" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="mr-2 size-4" />
            {showFilters ? "Ocultar" : "Filtros"}
          </Button>
          <ShowColumnsDropdown
            value={visibleColumns}
            options={fieldNames.map((value) => ({
              value,
              label: translateAdminKey(
                resource.resourceType,
                "field",
                value,
                "tableHeader",
              ),
            }))}
            onChange={setVisibleColumns}
          />
        </div>
      </div>
      {showFilters && (
        <ResourceListFiltersForm
          resource={resource}
          onHideFilters={() => setShowFilters(false)}
        />
      )}
      <div className="h-4"></div>
    </>
  );
}
