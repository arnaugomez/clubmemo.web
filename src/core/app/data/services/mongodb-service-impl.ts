import {
  Collection,
  Db,
  Document,
  MongoClient,
  ServerApiVersion,
} from "mongodb";
import { EnvService } from "../../domain/interfaces/env-service";
import { MongoService } from "../../domain/interfaces/mongo-service";
import { CollectionType } from "../../utils/mongo";
// eslint-disable-next-line @typescript-eslint/no-namespace
declare module global {
  let mongoClient: MongoClient;
}

export class MongoServiceImpl implements MongoService {
  readonly client: MongoClient;
  readonly db: Db;

  constructor(envService: EnvService) {
    this.client =
      global.mongoClient ??
      new MongoClient(envService.mongodbUrl, {
        serverApi: {
          version: ServerApiVersion.v1,
          // strict: true,
          deprecationErrors: true,
        },
      });
    global.mongoClient = this.client;
    this.db = this.client.db();
  }

  collection<TSchema extends Document = Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema> {
    return this.db.collection<TSchema>(collectionType.name);
  }
}
