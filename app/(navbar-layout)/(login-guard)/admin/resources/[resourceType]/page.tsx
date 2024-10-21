import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { ResourceListPage } from "@/src/admin/ui/resource-list/pages/resource-list-page";
import { locator_common_DatabaseIndexesService } from "@/src/common/locators/locator_database-indexes-service";

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
 */
export const dynamicParams = false;

/**
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const databaseIndexesService = locator_common_DatabaseIndexesService();
  await databaseIndexesService.createIndexes();
  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default ResourceListPage;
