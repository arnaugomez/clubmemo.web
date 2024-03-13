import { Db, MongoClient } from "mongodb";

export interface MongoService {
  readonly client: MongoClient;
  /**
   *  The default database of the mongodb cluster
   */
  readonly db: Db;
}
