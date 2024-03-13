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

export class MongoServiceImpl implements MongoService {
  readonly client: MongoClient;
  readonly db: Db;

  constructor(envService: EnvService) {
    this.client = new MongoClient(envService.mongodbUrl, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    this.db = this.client.db();
  }

  collection<TSchema extends Document = Document>(
    collectionType: CollectionType<TSchema>,
  ): Collection<TSchema> {
    return this.db.collection<TSchema>(collectionType.name);
  }
}
