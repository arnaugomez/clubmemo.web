import { z } from "zod";

export const GetTagSuggestionsActionSchema = z.object({
  query: z.string().optional(),
});

export type GetTagSuggestionsActionModel = z.infer<
  typeof GetTagSuggestionsActionSchema
>;
