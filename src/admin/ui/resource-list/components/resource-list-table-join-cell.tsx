import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type {
  AdminJoinModel,
  AdminResourceTypeModel,
} from "@/src/admin/domain/models/admin-resource-model";
import { TableCell } from "@/src/common/ui/components/shadcn/ui/table";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { translateAdminKey } from "../../i18n/admin-translations";

interface ResourceListTableJoinCellProps {
  resourceType: AdminResourceTypeModel;
  join: AdminJoinModel;
  data: AdminResourceData;
}

/**
 * Displays the value of an admin resource when the value is coming from an
 * external join. It displays it as a table cell in the resource list table.
 */
export function ResourceListTableJoinCell({
  resourceType,
  join,
  data,
}: ResourceListTableJoinCellProps) {
  function renderLink() {
    const value = data[join.name];
    if (!value) return "-";
    return (
      <Link
        href={`/admin/resources/${join.resourceType}/detail/${value._id}`}
        className="hover:underline"
      >
        {value.display ||
          translateAdminKey(resourceType, "field", join.name, "view")}
        <ExternalLinkIcon
          className="ml-2 inline-block -translate-y-px cursor-pointer hover:text-slate-900"
          size={14}
        />
      </Link>
    );
  }
  return (
    <TableCell className="min-w-[100px] max-w-[500px] truncate">
      {renderLink()}
    </TableCell>
  );
}
