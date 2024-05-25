import { z } from "../i18n/zod";

export const EmailSchema = z.string().email().max(254);
