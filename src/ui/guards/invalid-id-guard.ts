import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

export function invalidIdGuard(id: string) {
  if (!ObjectId.isValid(id)) notFound();
}
