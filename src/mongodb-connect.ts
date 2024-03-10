import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

interface Mongo {
  client: MongoClient;
  // Export a module-scoped MongoClient promise. By doing this in a
  // separate module, the client can be shared across functions.
  // `await clientPromise` will use the default database passed in the MONGODB_URI
  // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
  //
  // `const client = await clientPromise`
  // `const db = client.db("myDatabase")`
  //
  // Then you can execute queries against your database like so:
  // db.find({}) or any of the MongoDB Node Driver commands
  clientPromise: Promise<MongoClient>;
}

export const mongo = {} as Mongo;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    mongo.client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = mongo.client.connect();
  }
  mongo.clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  mongo.client = new MongoClient(uri, options);
  mongo.clientPromise = mongo.client.connect();
}
