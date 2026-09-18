import * as Schema from "effect/Schema";

/**
 * Validates the parameters of `getTagSuggestionsAction`
 */
export const GetTagSuggestionsActionSchema = Schema.Struct({
  query: Schema.optional(Schema.String),
});

/**
 * Parameters of `getTagSuggestionsAction`
 */
export type GetTagSuggestionsActionModel =
  (typeof GetTagSuggestionsActionSchema)["Type"];
