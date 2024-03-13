import { db } from "@/src/core/app/data/services/mongodb-service-impl";
import { RegisteredDatabaseUserAttributes } from "lucia";

export interface UserDoc extends RegisteredDatabaseUserAttributes {}
export const usersCollection = db.collection<UserDoc>("users");
