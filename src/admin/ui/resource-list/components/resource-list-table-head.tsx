import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { SortOrderModel } from "@/src/admin/domain/models/sort-order-model";
import { TableHead } from "@/src/common/ui/components/shadcn/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { translateAdminKey } from "../../i18n/admin-translations";

interface ResourceListTableHeadProps {
  resourceType: AdminResourceTypeModel;

  fieldName: string;
}

/**
 * Displays the headers of the table, with the name of the fields. The headers
 * are clickable and they allow the user to sort the table by the field.
 */
export function ResourceListTableHead({
  resourceType,
  fieldName,
}: ResourceListTableHeadProps): JSX.Element {
  const pathname = usePathname();
  const { push } = useRouter();
  const params = useSearchParams();

  function getSortOrder() {
    const sortBy = params.get("sortBy");
    const sortOrder = params.get("sortOrder");
    if (sortBy === fieldName)
      switch (sortOrder) {
        case SortOrderModel.ascending:
        case SortOrderModel.descending:
          return sortOrder;
      }
    return null;
  }
  const sortOrder = getSortOrder();

  function onClick() {
    const newParams = new URLSearchParams(params);
    switch (sortOrder) {
      case SortOrderModel.ascending:
        newParams.set("sortBy", fieldName);
        newParams.set("sortOrder", SortOrderModel.descending);
        break;
      case SortOrderModel.descending:
        newParams.delete("sortBy");
        newParams.delete("sortOrder");
        break;
      default:
        newParams.set("page", "1");
        newParams.set("sortBy", fieldName);
        newParams.set("sortOrder", SortOrderModel.ascending);
    }
    push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }
  function renderIcon() {
    switch (sortOrder) {
      case SortOrderModel.ascending:
        return " ↑";
      case SortOrderModel.descending:
        return " ↓";
      default:
        return null;
    }
  }
  return (
    <TableHead
      className="min-w-[100px] cursor-pointer truncate hover:bg-slate-100"
      role="button"
      onClick={onClick}
    >
      {translateAdminKey(resourceType, "field", fieldName, "tableHeader")}
      {renderIcon()}
    </TableHead>
  );
}
