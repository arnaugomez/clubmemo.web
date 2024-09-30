import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminResourceModel } from "@/src/admin/domain/models/admin-resource-model";
import { ConfirmDialog } from "@/src/common/ui/components/dialog/confirm-dialog";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import {
  TableCell,
  TableRow,
} from "@/src/common/ui/components/shadcn/ui/table";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import { EditIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteAdminResourceAction } from "../../actions/delete-admin-resource-action";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const detailHref = `/admin/resources/${resource.resourceType}/detail/${resourceData._id}`;
  async function handleRemove() {
    const result = await deleteAdminResourceAction({
      id: resourceData._id,
      resourceType: resource.resourceType,
    });
    const responseHandler = new ActionResponseHandler(result);
    if (!responseHandler.hasErrors) {
      onReload();
    }
    responseHandler.toastErrors();
    return responseHandler.hasErrors;
  }
  return (
    <>
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
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon />
            <span className="sr-only">Eliminar</span>
          </Button>
        </TableCell>
      </TableRow>
      {isDeleteDialogOpen && (
        <ConfirmDialog
          onAccept={handleRemove}
          onClose={() => setIsDeleteDialogOpen(false)}
          title="Eliminar recurso?"
          description="¿Estás seguro que deseas eliminar este recurso? Esta acción no se puede deshacer"
          acceptButtonText="Eliminar"
          acceptButtonVariant="destructive"
        />
      )}
    </>
  );
}
