import { Db, Document } from "mongodb";

export const collection =
  <TSchema extends Document = Document>(name: string) =>
  (db: Db) =>
    db.collection<TSchema>(name);
