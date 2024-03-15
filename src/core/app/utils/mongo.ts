import { Document } from "mongodb";

export type CollectionType<TSchema extends Document = Document> = {
  name: string;
  tschema?: TSchema;
};

export const collection = <TSchema extends Document = Document>(
  name: string,
): CollectionType<TSchema> => ({ name });
