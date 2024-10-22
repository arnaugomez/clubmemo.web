import type { Collection, Document } from "mongodb";

/**
 * Utility type that represents a MongoDB collection.
 */
export type CollectionType<
  TSchema extends Document,
  TName extends string = string,
> = {
  /**
   * String identifier of the collection in the database
   */
  name: TName;
  /**
   * Type of the MongoDB collection. Warning: use it for type inference only.
   * Its actual value is `undefined`.
   * @example private readonly users: typeof usersCollection.type;
   */
  type: Collection<TSchema>;
};

/**
 * Creates a MongoDB `CollectionType` object that identifies a database
 * collection.
 */
export const collection =
  <TSchema extends Document>() =>
  <TName extends string>(name: TName) =>
    ({ name }) as CollectionType<TSchema, TName>;
