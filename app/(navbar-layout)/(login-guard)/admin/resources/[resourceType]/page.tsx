import * as Effect from "effect/Effect";
import { adminResourcesConfig } from "@/src/admin/domain/config/admin-resources-config";
import { ResourceListPage } from "@/src/admin/ui/resource-list/pages/resource-list-page";
import { runServer } from "@/src/common/effect/server-runtime";
import { DatabaseIndexesService } from "@/src/common/layers/layer_database-indexes-service";

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
  return runServer(
    Effect.gen(function* () {
      const databaseIndexesService = yield* DatabaseIndexesService;
      yield* databaseIndexesService.createIndexes();

      return adminResourcesConfig.map((resource) => ({
        resourceType: resource.resourceType,
      }));
    }),
  );
}

export default ResourceListPage;
