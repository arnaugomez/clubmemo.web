import { getAdminResourceByType } from "@/src/admin/domain/config/admin-resources-config";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { AdminResourceIcon } from "../../components/admin-resource-icon";
import { translateAdminKey } from "../../i18n/admin-translations";
import type { PropsWithResourceTypeParam } from "../../models/props-with-resource-type-param";
import { ResourceListTable } from "../components/resource-list-table";
import { ResourceListTopButtons } from "../components/resource-list-top-buttons";

export function ResourceListPage({
  params: { resourceType },
}: PropsWithResourceTypeParam) {
  const resource = getAdminResourceByType(resourceType);
  return (
    <main>
      <div className="h-20" />

      <div className="px-4">
        <div className="mx-auto max-w-screen-lg">
          <ResourceListTopButtons resource={resource} />

          <div className="h-4"></div>

          <h1 className={textStyles.h2}>
            <AdminResourceIcon
              adminResourceType={resource.resourceType}
              className="mr-3 inline size-8 -translate-y-1"
            />
            {translateAdminKey(resource.resourceType, "plural")}
          </h1>
          <div className="h-4" />
          <p className={textStyles.p}>
            {translateAdminKey(resource.resourceType, "description")}
          </p>
        </div>

        <div className="h-10" />

        <ResourceListTable resource={resource} />
      </div>
    </main>
  );
}
