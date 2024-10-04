import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminFieldModel } from "@/src/admin/domain/models/admin-resource-model";
import { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  TableCell,
  TableRow,
} from "@/src/common/ui/components/shadcn/ui/table";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { DeleteResourceButton } from "../../components/delete-resource-button";
import { IdTableCell } from "./id-table-cell";
import { ResourceListTableCell } from "./resource-list-table-cell";

interface ResourceListTableRowProps {
  resourceType: AdminResourceTypeModel;
  fields: AdminFieldModel[];
  resourceData: AdminResourceData;
  onReload: () => void;
}

export function ResourceListTableRow({
  resourceType,
  fields,
  resourceData,
  onReload,
}: ResourceListTableRowProps) {
  const detailHref = `/admin/resources/${resourceType}/detail/${resourceData._id}`;
  return (
    <TableRow key={resourceData._id}>
      <IdTableCell id={resourceData._id} resourceType={resourceType} />
      {fields.map((field) => (
        <ResourceListTableCell
          key={field.name}
          resourceType={resourceType}
          field={field}
          data={resourceData}
        />
      ))}
      <TableCell className="flex h-[53px] items-center space-x-2 py-0">
        {resourceType !== AdminResourceTypeModel.sessions && (
          <Button variant="secondary" size="icon" asChild>
            <Link href={detailHref}>
              <EditIcon />
              <span className="sr-only">Editar</span>
            </Link>
          </Button>
        )}
        <DeleteResourceButton
          size="icon"
          id={resourceData._id}
          resourceType={resourceType}
          onDeleted={onReload}
        >
          <Trash2Icon />
          <span className="sr-only">Eliminar</span>
        </DeleteResourceButton>
      </TableCell>
    </TableRow>
  );
}
