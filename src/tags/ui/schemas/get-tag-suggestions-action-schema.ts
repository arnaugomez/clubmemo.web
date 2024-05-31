import { z } from "@/i18n/zod";

/**
 * Validates the parameters of `getTagSuggestionsAction`
 */
export const GetTagSuggestionsActionSchema = z.object({
  query: z.string().optional(),
});

/**
 * Parameters of `getTagSuggestionsAction`
 */
export type GetTagSuggestionsActionModel = z.infer<
  typeof GetTagSuggestionsActionSchema
>;
