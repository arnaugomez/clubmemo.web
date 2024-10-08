import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import { ArrowLink } from "@/src/common/ui/components/button/arrow-link";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { notFound } from "next/navigation";
import { AdminResourceIcon } from "../../components/admin-resource-icon";
import { translateAdminKey } from "../../i18n/admin-translations";
import type { PropsWithResourceTypeParam } from "../../models/props-with-resource-type-param";
import { CreateResourceForm } from "../components/create-resource-form";
import { CreateResourceAlert } from "../components/create-resource-warning";

export function CreateResourcePage({
  params: { resourceType },
}: PropsWithResourceTypeParam) {
  const resource = getAdminResourceByType(resourceType);
  if (resource.cannotCreate) notFound();
  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <ArrowLink href={`/admin/resources/${resourceType}`} isLeft>
            Volver
          </ArrowLink>

          <div className="h-8" />

          <h1 className={textStyles.h2}>
            <AdminResourceIcon
              adminResourceType={resourceType}
              className="mr-3 inline size-8 -translate-y-1"
            />
            Crear {translateAdminKey(resourceType, "singular", "lowercase")}
          </h1>
          <div className="h-10" />
          {resource.showCreationWarning && (
            <>
              <CreateResourceAlert resource={resource} />
              <div className="h-8" />
            </>
          )}
          <CreateResourceForm resourceType={resourceType} />
        </div>
      </div>
    </main>
  );
}
