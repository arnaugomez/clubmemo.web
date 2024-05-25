import { ObjectId } from "mongodb";
import { z } from "zod";

export const PaginateNotesActionSchema = z.object({
  courseId: z.string().refine(ObjectId.isValid),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type PaginateNotesActionModel = z.infer<
  typeof PaginateNotesActionSchema
>;
