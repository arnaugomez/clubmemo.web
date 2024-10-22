import type { Collection, Document, MongoClient } from "mongodb";
import type { CollectionType } from "../../data/utils/mongodb";

/**
 * Service to interact with the MongoDB database.
 *
 * Encapsulates the MongoDB client and provides methods to interact with
 * collections. It is recommended to use the `collection` method to get a
 * collection instead of using the MongoDB client directly. However, it also
 * exposes the MongoDB client for more advanced use cases.
 */
export interface DatabaseService {
  readonly client: MongoClient;

  /**
   * Gets a MongoDB collection by its type.
   *
   * @param collectionType - The collection type object defined in the collection file with the `collection` function.
   * @see `collection` function in the MongoDB utils file.
   */
  collection<TSchema extends Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema>;
}
