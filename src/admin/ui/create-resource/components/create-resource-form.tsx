"use client";
import { getAdminResourceSchema } from "@/src/admin/domain/config/admin-resource-schemas";
import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { getDefaultValuesOfAdminResource } from "@/src/admin/domain/models/admin-resource-model";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createAdminResourceAction } from "../../actions/create-admin-resource-action";
import { translateAdminKey } from "../../i18n/admin-translations";

interface CreateResourceFormProps {
  resourceType: AdminResourceTypeModel;
}
export function CreateResourceForm({ resourceType }: CreateResourceFormProps) {
  const resource = getAdminResourceByType(resourceType);
  const { push } = useRouter();
  const schema = useMemo(
    () =>
      getAdminResourceSchema({
        resourceType,
        isCreate: true,
      }),
    [resourceType],
  );
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValuesOfAdminResource(resource.fields),
  });

  async function onSubmit(data: AdminResourceData) {
    try {
      const response = await createAdminResourceAction({
        resourceType,
        data,
      });
      const handler = new FormResponseHandler(response, form);
      if (handler.hasErrors) {
        return handler.setErrors();
      } else if (handler.data) {
        toast.success("Recurso creado correctamente");
        push(`/admin/resources/${resourceType}/detail/${handler.data.id}`);
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al crear el recurso");
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormGlobalErrorMessage />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href={`/admin/resources/${resourceType}`}>Volver</Link>
          </Button>
          <FormSubmitButton>
            Crear {translateAdminKey(resourceType, "singular")}
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
