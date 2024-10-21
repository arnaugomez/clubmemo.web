import type { Collection, Db, Document } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { DatabaseService } from "../../domain/interfaces/database-service";
import type { EnvService } from "../../domain/interfaces/env-service";
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
 * Implementation of `DatabaseService` using the MongoDB Node.js driver.
 */
export class DatabaseServiceImpl implements DatabaseService {
  readonly client: MongoClient;

  private static createClient(envService: EnvService): MongoClient {
    return new MongoClient(envService.mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    });
  }

  constructor(
    envService: EnvService,
    private readonly dbName?: string,
  ) {
    if (envService.cacheMongodbClient) {
      global.mongoClient ??= DatabaseServiceImpl.createClient(envService);
      this.client = global.mongoClient;
    } else {
      this.client = DatabaseServiceImpl.createClient(envService);
    }
  }

  /**
   *  The default database of the mongodb cluster
   */
  get db(): Db {
    return this.client.db(this.dbName);
  }

  collection<TSchema extends Document = Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema> {
    return this.db.collection<TSchema>(collectionType.name);
  }
}
