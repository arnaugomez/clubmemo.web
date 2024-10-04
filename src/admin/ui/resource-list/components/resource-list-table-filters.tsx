import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { FilterIcon } from "lucide-react";
import { useState } from "react";
import { translateAdminKey } from "../../i18n/admin-translations";
import { ResourceListTableSearch } from "./resource-list-table-search";
import { ShowColumnsDropdown } from "./show-columns-dropdown";

interface ResourceListTableFiltersProps {
  resourceType: AdminResourceTypeModel;
  fieldNames: string[];
  setVisibleColumns: (fieldNames: string[]) => void;
  visibleColumns: string[];
}
export function ResourceListTableFilters({
  visibleColumns,
  fieldNames,
  resourceType,
  setVisibleColumns,
}: ResourceListTableFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <>
      <div className="flex space-x-4">
        <ResourceListTableSearch resourceType={resourceType} />
        <Button
          className="w-32 flex-none"
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon className="mr-2 size-4" />
          {showFilters ? "Ocultar" : "Filtros"}
        </Button>
        <div className="flex-none">
          <ShowColumnsDropdown
            value={visibleColumns}
            options={fieldNames.map((value) => ({
              value,
              label: translateAdminKey(
                resourceType,
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
        <div className="mt-2 rounded-md border-[1px] border-slate-300 bg-slate-100 p-4">
          <h3 className={textStyles.h4}>Filtros</h3>
        </div>
      )}
      <div className="h-4"></div>
    </>
  );
}
