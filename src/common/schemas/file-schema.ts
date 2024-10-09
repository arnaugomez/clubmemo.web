import { z } from "../i18n/zod";

export const FileSchema = z.instanceof(File, { params: { i18n: "file" } });
export const FileFieldSchema = z.string().or(FileSchema);
export const OptionalFileFieldSchema = FileFieldSchema.nullish().transform(
  (x) => x ?? undefined,
);
