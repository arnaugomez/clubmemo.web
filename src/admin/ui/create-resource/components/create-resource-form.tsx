"use client";
import { getAdminResourceSchema } from "@/src/admin/domain/config/admin-resource-schemas-config";
import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import {
  AdminFieldTypeModel,
  getDefaultValuesOfAdminResource,
} from "@/src/admin/domain/models/admin-resource-model";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { locator_fileUpload_ClientFileUploadService } from "@/src/file-upload/locators/locator_client-file-upload-service";
import { uploadFileAction } from "@/src/file-upload/ui/actions/upload-file-action";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAdminResourceAction } from "../../actions/create-admin-resource-action";
import { translateAdminKey } from "../../i18n/admin-translations";
import { AdminFields } from "../../resource-form/admin-fields";

interface CreateResourceFormProps {
  resourceType: AdminResourceTypeModel;
}

/**
 * Form that contains the fields of an admin resource. When the form is
 * submitted, it creates a new resource with the data entered by the user.
 */
export function CreateResourceForm({ resourceType }: CreateResourceFormProps) {
  const resource = getAdminResourceByType(resourceType);
  const { push } = useRouter();
  const schema = getAdminResourceSchema({
    resourceType,
    isCreate: true,
  });
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValuesOfAdminResource(resource.fields),
  });

  async function onSubmit(data: AdminResourceData) {
    try {
      for (const field of resource.fields.filter(
        (f) => f.fieldType === AdminFieldTypeModel.file,
      )) {
        const fieldValue = data[field.name];
        if (fieldValue instanceof File) {
          const response = await uploadFileAction({
            collection: resource.resourceType as "profiles",
            field: field.name as "picture",
            contentType: fieldValue.type,
          });
          const handler = new FormResponseHandler(response, form);
          if (handler.hasErrors) {
            handler.setErrors();
            return;
          } else if (handler.data) {
            const fileUploadService =
              locator_fileUpload_ClientFileUploadService();
            await fileUploadService.uploadPresignedUrl({
              file: fieldValue,
              presignedUrl: handler.data.presignedUrl,
            });
            data[field.name] = handler.data.url;
          }
        }
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al subir los ficheros");
      return;
    }

    try {
      const response = await createAdminResourceAction({
        resourceType,
        data,
      });
      const handler = new FormResponseHandler(response, form);
      if (handler.hasErrors) {
        return handler.setErrors();
      } else if (handler.data) {
        toast.success("El recurso ha sido creado");
        push(`/admin/resources/${resourceType}/detail/${handler.data.id}`);
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      FormResponseHandler.setGlobalError(form);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AdminFields resourceType={resourceType} fields={resource.fields} />
        <FormGlobalErrorMessage />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href={`/admin/resources/${resourceType}`}>Volver</Link>
          </Button>
          <FormSubmitButton>
            Crear {translateAdminKey(resourceType, "singular", "lowercase")}
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
