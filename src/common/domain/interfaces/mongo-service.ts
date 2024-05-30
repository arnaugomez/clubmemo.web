import type { Collection, Db, MongoClient, Document } from "mongodb";
import type { CollectionType } from "../../data/utils/mongo";

export interface MongoService {
  readonly client: MongoClient;
  /**
   *  The default database of the mongodb cluster
   */
  readonly db: Db;

  collection<TSchema extends Document = Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema>;
}
