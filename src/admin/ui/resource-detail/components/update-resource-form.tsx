"use client";
import { getAdminResourceSchema } from "@/src/admin/domain/config/admin-resource-schemas-config";
import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import type { AdminResourceData } from "@/src/admin/domain/models/admin-resource-data";
import { getDefaultValuesOfAdminResource } from "@/src/admin/domain/models/admin-resource-model";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { FormGlobalErrorMessage } from "@/src/common/ui/components/form/form-global-error-message";
import { FormSubmitButton } from "@/src/common/ui/components/form/form-submit-button";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { Skeleton } from "@/src/common/ui/components/shadcn/ui/skeleton";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateAdminResourceAction } from "../../actions/update-admin-resource-action";
import { translateAdminKey } from "../../i18n/admin-translations";
import { AdminFields } from "../../resource-form/admin-fields";
import { useResourceDetailContext } from "../context/resource-detail-context";
import { ResourceFormId } from "./resource-form-id";

export function UpdateResourceForm() {
  const { data, id, resourceType } = useResourceDetailContext();
  const resource = getAdminResourceByType(resourceType);
  const schema = getAdminResourceSchema({
    resourceType,
    isCreate: false,
  });
  const form = useForm({
    resolver: zodResolver(schema),
    values: data ?? undefined,
    defaultValues: getDefaultValuesOfAdminResource(resource.fields),
  });

  async function onSubmit(data: AdminResourceData) {
    try {
      const response = await updateAdminResourceAction({
        resourceType,
        id,
        data,
      });
      const handler = new FormResponseHandler(response, form);
      if (handler.hasErrors) {
        return handler.setErrors();
      } else {
        toast.success("Recurso modificado correctamente");
      }
    } catch (error) {
      locator_common_ErrorTrackingService().captureError(error);
      toast.error("Error al modificar el recurso");
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ResourceFormId id={id} />
        <FormContent />
        <FormGlobalErrorMessage />
        <div className="flex justify-between space-x-6">
          <Button variant="ghost" asChild>
            <Link href={`/admin/resources/${resourceType}`}>Volver</Link>
          </Button>
          <FormSubmitButton disabled={!data}>
            Modificar {translateAdminKey(resourceType, "singular")}
          </FormSubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}

function FormContent() {
  const { isLoading, data, hasError, isNotFound, resourceType } =
    useResourceDetailContext();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10" />
          </div>
        ))}
      </div>
    );
  } else if (hasError) {
    return <div>Error al cargar los datos.</div>;
  } else if (isNotFound || !data) {
    return <div>Este recurso no existe.</div>;
  }
  const resource = getAdminResourceByType(resourceType);
  return <AdminFields resourceType={resourceType} fields={resource.fields} />;
}
