import { ConfirmDialog } from "@/src/common/ui/components/dialog/confirm-dialog";
import type { ButtonProps } from "@/src/common/ui/components/shadcn/ui/button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import { useState, type PropsWithChildren } from "react";
import { getAdminResourceByType } from "../../domain/config/admin-resources-config";
import type { AdminResourceTypeModel } from "../../domain/models/admin-resource-model";
import { deleteAdminResourceAction } from "../actions/delete-admin-resource-action";
import { translateAdminKey } from "../i18n/admin-translations";

interface DeleteResourceButtonProps extends PropsWithChildren {
  id: string;
  disabled?: boolean;
  resourceType: AdminResourceTypeModel;
  onDeleted?: () => void;
  size?: ButtonProps["size"];
  className?: string;
}
export function DeleteResourceButton({
  id,
  disabled,
  resourceType,
  onDeleted,
  children,
  size,
  className,
}: DeleteResourceButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  async function handleRemove() {
    const result = await deleteAdminResourceAction({
      id,
      resourceType,
    });
    const responseHandler = new ActionResponseHandler(result);
    if (!responseHandler.hasErrors) {
      onDeleted?.();
    }
    responseHandler.toastErrors();
    return responseHandler.hasErrors;
  }

  function getAlertProps() {
    const resource = getAdminResourceByType(resourceType);
    if (resource.showDeleteAlert) {
      return {
        alertTitle: translateAdminKey(resourceType, "deleteAlert", "title"),
        alertDescription: translateAdminKey(
          resourceType,
          "deleteAlert",
          "description",
        ),
      };
    }
    return {};
  }
  return (
    <>
      <Button
        variant="destructive"
        size={size}
        disabled={disabled}
        onClick={() => setIsDeleteDialogOpen(true)}
        className={className}
      >
        {children}
      </Button>
      {isDeleteDialogOpen && (
        <ConfirmDialog
          onAccept={handleRemove}
          onClose={() => setIsDeleteDialogOpen(false)}
          title={`Eliminar ${translateAdminKey(resourceType, "singular")}?`}
          description="¿Estás seguro que deseas eliminar este recurso? Esta acción no se puede deshacer."
          acceptButtonText="Eliminar"
          acceptButtonVariant="destructive"
          {...getAlertProps()}
        />
      )}
    </>
  );
}
