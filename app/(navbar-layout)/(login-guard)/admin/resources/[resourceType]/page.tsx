import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { ResourceListPage } from "@/src/admin/ui/resource-list/pages/resource-list-page";
import { locator_common_DatabaseIndexesService } from "@/src/common/locators/locator_database-indexes-service";

/**
 * If the browser visits a URL that does not match the defined
 * values of the `resourceType` route segment, it will show a 404 page
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
 */
export const dynamicParams = false;

/**
 * Generates the possible values of the path parameters for the page.
 *
 * It also generates database indexes. Index generation should be done once, at
 * build time, because doing it at runtime on every request introduces an
 * additional overhead to the web servers and increases latency.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const databaseIndexesService = locator_common_DatabaseIndexesService();
  await databaseIndexesService.createIndexes();

  return adminResourcesConfig.map((resource) => ({
    resourceType: resource.resourceType,
  }));
}

export default ResourceListPage;
