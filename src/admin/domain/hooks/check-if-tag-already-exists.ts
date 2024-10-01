import type { Db } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";

export async function checkIfTagAlreadyExists(name: string, db: Db) {
  const count = await db.collection("tags").countDocuments({ name });
  if (count) {
    throw new ZodError([
      {
        path: ["name"],
        code: ZodIssueCode.custom,
        params: { i18n: "tagAlreadyExists" },
        message: "Ya existe una etiqueta con ese nombre",
      },
    ]);
  }
}
