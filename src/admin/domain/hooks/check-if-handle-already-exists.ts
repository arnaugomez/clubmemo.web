import type { Db } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfHandleAlreadyExists(
  data: AdminResourceData,
  db: Db,
) {
  const count = await db
    .collection("profiles")
    .countDocuments({ handle: data.handle });
  if (count) {
    throw new ZodError([
      {
        path: ["name"],
        code: ZodIssueCode.custom,
        params: { i18n: "handleAlreadyExists" },
        message: "Ya existe un identificador de usuario con ese nombre",
      },
    ]);
  }
}
