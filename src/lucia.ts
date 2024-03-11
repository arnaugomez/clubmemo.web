import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia, RegisteredDatabaseUserAttributes } from "lucia";
import { mongoClient } from "./mongo";

const db = mongoClient.db();
export const usersCollection = db.collection<UserDoc>("users");
export const sessionsCollection = db.collection<SessionDoc>("sessions");

const adapter = new MongodbAdapter(sessionsCollection, usersCollection);

interface UserDoc extends RegisteredDatabaseUserAttributes {
  _id: string;
}

interface SessionDoc {
  _id: string;
  expires_at: Date;
  user_id: string;
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes(attributes: RegisteredDatabaseUserAttributes) {
    return {
      email: attributes.email,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  hashed_password: string;
}
