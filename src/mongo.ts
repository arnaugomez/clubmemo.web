import { MongoClient, ServerApiVersion } from "mongodb";
const url = process.env.MONGODB_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongoClient = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
export async function connectToMongo() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}
