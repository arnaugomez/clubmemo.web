import { z } from "../i18n/zod";

export const FileSchema = z.instanceof(File, { params: { i18n: "file" } });
