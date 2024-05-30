import type { Collection, Db, Document } from "mongodb";
import { MongoClient, ServerApiVersion } from "mongodb";
import type { EnvService } from "../../domain/interfaces/env-service";
import type { MongoService } from "../../domain/interfaces/mongo-service";
import type { CollectionType } from "../utils/mongo";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let mongoClient: MongoClient;
}

export class MongoServiceImpl implements MongoService {
  readonly client: MongoClient;
  readonly db: Db;

  constructor(envService: EnvService) {
    global.mongoClient ??= new MongoClient(envService.mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        // strict: true,
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
