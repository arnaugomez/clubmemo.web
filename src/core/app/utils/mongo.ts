import { Collection, Document } from "mongodb";

export type CollectionType<TSchema extends Document = Document> = {
  name: string;
  type: Collection<TSchema>;
};

export const collection = <TSchema extends Document = Document>(
  name: string,
): CollectionType<TSchema> => ({ name }) as CollectionType<TSchema>;
