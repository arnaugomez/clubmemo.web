import type { UserDoc } from "@/src/auth/data/collections/users-collection";
import {
  LuciaUserTransformer,
  UserDocTransformer,
} from "@/src/auth/data/collections/users-collection";
import { UserModel } from "@/src/auth/domain/models/user-model";
import type { User } from "lucia";
import type { WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { describe, expect, it } from "vitest";
import { AuthTypeModel } from "../../domain/models/auth-type-model";

describe("UserDocTransformer", () => {
  it("transforms UserDoc to UserModel correctly", () => {
    const mockUserDoc: WithId<UserDoc> = {
      _id: new ObjectId("507f191e810c19729de860ea"),
      email: "test@example.com",
      acceptTerms: true,
      authTypes: [AuthTypeModel.email],
      hashed_password: "hashedPassword",
      isEmailVerified: true,
    };
    const transformer = new UserDocTransformer(mockUserDoc);
    const userModel = transformer.toDomain();
    expect(userModel).toBeInstanceOf(UserModel);
    expect(userModel.id).toBe(mockUserDoc._id.toString());
    expect(userModel.email).toBe(mockUserDoc.email);
  });
});

describe("LuciaUserTransformer", () => {
  it("transforms Lucia User to UserModel correctly", () => {
    const mockLuciaUser: User = {
      email: "test@example.com",
      acceptTerms: true,
      authTypes: [AuthTypeModel.email],
      id: new ObjectId(),
      isEmailVerified: true,
    };
    const transformer = new LuciaUserTransformer(mockLuciaUser);
    const userModel = transformer.toDomain();
    expect(userModel).toBeInstanceOf(UserModel);
    expect(userModel.id).toBe(mockLuciaUser.id.toString());
    expect(userModel.email).toBe(mockLuciaUser.email);
  });
});
