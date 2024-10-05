import type {
  AdminFieldModel,
  AdminResourceTypeModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { SortOrderModel } from "@/src/admin/domain/models/sort-order-model";
import { TableHead } from "@/src/common/ui/components/shadcn/ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { translateAdminKey } from "../../i18n/admin-translations";

interface ResourceListTableHeadProps {
  resourceType: AdminResourceTypeModel;

  field: AdminFieldModel;
}

export function ResourceListTableHead({
  resourceType,
  field,
}: ResourceListTableHeadProps): JSX.Element {
  const pathname = usePathname();
  const { push } = useRouter();
  const params = useSearchParams();

  function getSortOrder() {
    const sortBy = params.get("sortBy");
    const sortOrder = params.get("sortOrder");
    if (sortBy === field.name)
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
        newParams.set("sortBy", field.name);
        newParams.set("sortOrder", SortOrderModel.descending);
        break;
      case SortOrderModel.descending:
        newParams.delete("sortBy");
        newParams.delete("sortOrder");
        break;
      default:
        newParams.set("page", "1");
        newParams.set("sortBy", field.name);
        newParams.set("sortOrder", SortOrderModel.ascending);
    }
    push(`${pathname}?${newParams.toString()}`);
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
      key={field.name}
      className="min-w-[100px] truncate cursor-pointer hover:bg-slate-100"
      role="button"
      onClick={onClick}
    >
      {translateAdminKey(resourceType, "field", field.name, "tableHeader")}
      {renderIcon()}
    </TableHead>
  );
}
