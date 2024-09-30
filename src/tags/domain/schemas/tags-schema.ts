import { z } from "zod";

export const TagNameSchema = z.string().trim().min(1).max(50);

export const TagsSchema = z.array(TagNameSchema).max(10);
