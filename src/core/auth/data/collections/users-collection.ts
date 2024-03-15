import { collection } from "@/src/core/app/utils/mongo";
import { RegisteredDatabaseUserAttributes } from "lucia";
import { WithId } from "mongodb";
import { UserModel } from "../../domain/models/user-model";

export interface UserDoc extends RegisteredDatabaseUserAttributes {}
export const usersCollection = collection<UserDoc>("users");

export function userTransformer(doc: WithId<UserDoc>): UserModel {
  return new UserModel({
    id: doc._id.toString(),
    ...doc,
  });
}
