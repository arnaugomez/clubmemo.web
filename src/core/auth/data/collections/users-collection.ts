import { collection } from "@/src/core/app/utils/mongo";
import { RegisteredDatabaseUserAttributes } from "lucia";

export interface UserDoc extends RegisteredDatabaseUserAttributes {}
export const usersCollection = collection<UserDoc>("users");
