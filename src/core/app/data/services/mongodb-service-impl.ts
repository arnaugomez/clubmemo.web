import {
  Collection,
  Db,
  MongoClient,
  ServerApiVersion,
  Document,
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

// export async function connectToMongo() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await mongoClient.connect();
//     // Send a ping to confirm a successful connection
//     await mongoClient.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoClient.close();
//   }
// }