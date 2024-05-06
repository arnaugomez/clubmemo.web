import type { WithId } from "mongodb";
import { UserModel } from "../../domain/models/user-model";
import type { UserDoc } from "../collections/users-collection";

export function userTransformer(doc: WithId<UserDoc>): UserModel {
  return new UserModel({
    id: doc._id.toString(),
    ...doc,
  });
}
