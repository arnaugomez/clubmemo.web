import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { Lucia, RegisteredDatabaseUserAttributes } from "lucia";
import { mongoClient } from "./mongodb-connect";

const db = mongoClient.db();
const User = db.collection<UserDoc>("users");
const Session = db.collection<SessionDoc>("sessions");

const adapter = new MongodbAdapter(Session, User);

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
  getUserAttributes(attributes: DatabaseUserAttributes) {
    return {
      email: attributes.email,
    };
  },
});

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
}
