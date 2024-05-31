import type { Collection, Db, Document } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { EnvService } from "../../domain/interfaces/env-service";
import type { MongoService } from "../../domain/interfaces/mongo-service";
import type { CollectionType } from "../utils/mongo";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  /**
   * Singleton instance of the MongoDB client. Avoids creating multiple
   * connections to the database in development environment, when doing
   * hot reloads constantly.
   */
  let mongoClient: MongoClient;
}

/**
 * Implementation of `MongoService` using the MongoDB Node.js driver.
 */
export class MongoServiceImpl implements MongoService {
  readonly client: MongoClient;
  /**
   *  The default database of the mongodb cluster
   */
  private readonly db: Db;

  constructor(envService: EnvService) {
    global.mongoClient ??= new MongoClient(envService.mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    });
    this.client = global.mongoClient;
    this.db = this.client.db();
  }

  collection<TSchema extends Document = Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema> {
    return this.db.collection<TSchema>(collectionType.name);
  }
}
