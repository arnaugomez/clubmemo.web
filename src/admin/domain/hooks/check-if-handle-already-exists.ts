import type { Db } from "mongodb";
import { ZodError, ZodIssueCode } from "zod";
import type { AdminResourceData } from "../models/admin-resource-data";

export async function checkIfHandleAlreadyExists(
  data: AdminResourceData,
  db: Db,
) {
  const document = await db
    .collection("profiles")
    .findOne({ handle: data.handle });
  if (document) {
    if (document._id.toString() === data._id) return;
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
