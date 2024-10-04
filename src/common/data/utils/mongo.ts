import type { Collection, Document } from "mongodb";

export type CollectionType<
  TSchema extends Document = Document,
  TName extends string = string,
> = {
  name: TName;
  type: Collection<TSchema>;
};

export const collection = <
  TSchema extends Document = Document,
  TName extends string = string,
>(
  name: TName,
) => ({ name, type: undefined as unknown as Collection<TSchema> });
