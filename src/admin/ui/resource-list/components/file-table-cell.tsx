import { TableCell } from "@/src/common/ui/components/shadcn/ui/table";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface FileTableCellProps {
  href: string;
}
/**
 * Displays a data of a file field in the cell of the admin resource list table.
 * Shows a link to the file.
 */
export function FileTableCell({ href }: FileTableCellProps) {
  href = href?.trim();

  function renderLink() {
    if (!href) return null;
    return (
      <Link href={href} className="hover:underline">
        Ver archivo
        <ExternalLinkIcon
          className="ml-2 inline-block -translate-y-px cursor-pointer hover:text-slate-900"
          size={14}
        />
      </Link>
    );
  }

  return (
    <TableCell className={cn(textStyles.mutedLink, "whitespace-nowrap")}>
      {renderLink() || "-"}
    </TableCell>
  );
}
