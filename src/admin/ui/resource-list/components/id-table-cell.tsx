import { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { TableCell } from "@/src/common/ui/components/shadcn/ui/table";
import { useClipboard } from "@/src/common/ui/hooks/use-clipboard";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { CopyIcon } from "lucide-react";
import Link from "next/link";

interface IdTableCellProps {
  id?: string;
  resourceType?: AdminResourceTypeModel;
}
export function IdTableCell({ id, resourceType }: IdTableCellProps) {
  const { copyToClipboard } = useClipboard();

  function renderLink() {
    if (
      !resourceType ||
      resourceType === AdminResourceTypeModel.sessions ||
      !id
    )
      return id;
    return (
      <Link
        href={`/admin/resources/${resourceType}/detail/${id}`}
        className="hover:underline"
      >
        {id}
      </Link>
    );
  }

  return (
    <TableCell className={cn(textStyles.mutedLink, "whitespace-nowrap")}>
      {renderLink() || "-"}
      {id && (
        <CopyIcon
          className="ml-2 inline-block -translate-y-px cursor-pointer hover:text-slate-900"
          role="button"
          onClick={() => copyToClipboard(id)}
          size={14}
        />
      )}
    </TableCell>
  );
}
