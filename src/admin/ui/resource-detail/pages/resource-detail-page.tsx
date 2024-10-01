import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import { AdminResourceIcon } from "../../components/admin-resource-icon";
import { translateAdminKey } from "../../i18n/admin-translations";
import { ResourceDetailTopButtons } from "../components/resource-detail-top-buttons";
import { ResourceDetailContextProvider } from "../context/resource-detail-context";
export interface ResourceDetailPageProps {
  params: {
    resourceType: AdminResourceTypeModel;
    id: string;
  };
}

export function ResourceDetailPage({
  params: { resourceType, id },
}: ResourceDetailPageProps) {
  const resource = getAdminResourceByType(resourceType);
  if (!resource || !ObjectId.isValid(id)) {
    notFound();
  }

  return (
    <main>
      <div className="h-20" />
      <div className="px-4">
        <div className="mx-auto max-w-prose">
          <ResourceDetailContextProvider resourceType={resourceType} id={id}>
            <ResourceDetailTopButtons resourceType={resourceType} />

            <div className="h-8" />

            <h1 className={textStyles.h2}>
              <AdminResourceIcon
                adminResourceType={resourceType}
                className="mr-3 inline size-8 -translate-y-1"
              />
              Editar {translateAdminKey(resourceType, "singular")}
            </h1>
            <div className="h-10" />
          </ResourceDetailContextProvider>
        </div>
      </div>
    </main>
  );
}
