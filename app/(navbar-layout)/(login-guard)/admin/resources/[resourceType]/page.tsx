import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { ResourceListPage } from "@/src/admin/ui/resource-list/pages/resource-list-page";

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
 */
export const dynamicParams = false;

/**
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default ResourceListPage;
