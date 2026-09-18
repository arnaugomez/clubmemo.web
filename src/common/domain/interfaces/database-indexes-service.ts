import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type { ExternalServiceError } from "@/src/common/effect/errors";
/**
 * Service to manage database indexes. Indexes are used to speed up
 * queries and enforce constraints. This service is responsible for
 * the initial setup of indexes in the database.
 */
export interface DatabaseIndexesService {
  /**
   * Create all indexes in the database. Should be called once, when the
   * application builds.
   */
  createIndexes(): Effect.Effect<void, ExternalServiceError>;
}

export const DatabaseIndexesService = Context.Service<DatabaseIndexesService>(
  "clubmemo/common/domain/interfaces/database-indexes-service/DatabaseIndexesService",
);
