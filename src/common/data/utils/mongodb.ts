import type { Collection, Document } from "mongodb";

export type CollectionType<
  TSchema extends Document,
  TName extends string = string,
> = {
  name: TName;
  type: Collection<TSchema>;
};

export const collection =
  <TSchema extends Document>() =>
  <TName extends string>(name: TName) => ({
    name,
    type: undefined as unknown as Collection<TSchema>,
  });
