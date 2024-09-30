import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { AdminResourceIcon } from "../../components/admin-resource-icon";
import { translateAdminKey } from "../../i18n/admin-translations";
import type { PropsWithResourceTypeParam } from "../../models/props-with-resource-type-param";
import { CreateResourceForm } from "../components/create-resource-form";
import { CreateResourceAlert } from "../components/create-resource-warning";

export function CreateResourcePage({
  params: { resourceType },
}: PropsWithResourceTypeParam) {
  const resource = getAdminResourceByType(resourceType);
  return (
    <main>
      <div className="h-24" />
      <div className="px-4">
        <div className="mx-auto max-w-screen-lg">
          <h1 className={textStyles.h2}>
            <AdminResourceIcon
              adminResourceType={resourceType}
              className="mr-3 inline size-8 -translate-y-1"
            />
            Crear {translateAdminKey(resourceType, "singular")}
          </h1>
          <div className="h-10" />
          <CreateResourceAlert resource={resource} />
          <CreateResourceForm resourceType={resourceType} />
        </div>
      </div>
    </main>
  );
}
