import type { Collection, Document } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { DatabaseService } from "../../domain/interfaces/database-service";
import type { EnvService } from "../../domain/interfaces/env-service";
import type { CollectionType } from "../utils/mongodb";
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
  /**
   * The MongoDB database client instance.
   */
  readonly client: MongoClient;

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
   * Creates a new instance of a MongoDB client. Each client instance initiates
   * a new database connection.
   *
   * @param envService The service that provides environment variables.
   * @returns The new instance of the MongoDB client.
   */
  private static createClient(envService: EnvService): MongoClient {
    return new MongoClient(envService.mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
      },
    });
  }

  /**
   * Gets a MongoDB collection by its type.
   *
   * @param collectionType - The collection type object defined in the collection file with the `collection` function.
   * @see `collection` function in the MongoDB utils file.
   */
  collection<TSchema extends Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema> {
    return this.client.db(this.dbName).collection<TSchema>(collectionType.name);
  }
}
