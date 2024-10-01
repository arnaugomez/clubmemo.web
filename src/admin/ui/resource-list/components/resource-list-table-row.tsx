import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  TableCell,
  TableRow,
} from "@/src/common/ui/components/shadcn/ui/table";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { DeleteResourceButton } from "../../components/delete-resource-button";

interface ResourceListTableRowProps {
  resource: AdminResourceModel;
  resourceData: AdminResourceData;
  onReload: () => void;
}

export function ResourceListTableRow({
  resource,
  resourceData,
  onReload,
}: ResourceListTableRowProps) {
  const detailHref = `/admin/resources/${resource.resourceType}/detail/${resourceData._id}`;
  return (
    <TableRow key={resourceData._id}>
      <TableCell className="min-w-[100px]">
        <Link href={detailHref} className="hover:underline">
          {resourceData._id}
        </Link>
      </TableCell>
      {resource.fields.map((field) => (
        <TableCell
          className="min-w-[100px] max-w-[500px] truncate"
          key={field.name}
        >
          {resourceData[field.name]?.toString() || "-"}
        </TableCell>
      ))}
      <TableCell className="flex h-[53px] items-center space-x-2 py-0">
        <Button variant="secondary" size="icon" asChild>
          <Link href={detailHref}>
            <EditIcon />
            <span className="sr-only">Editar</span>
          </Link>
        </Button>
        <DeleteResourceButton
          size="icon"
          id={resourceData._id}
          resourceType={resource.resourceType}
          onDeleted={onReload}
        >
          <Trash2Icon />
          <span className="sr-only">Eliminar</span>
        </DeleteResourceButton>
      </TableCell>
    </TableRow>
  );
}
