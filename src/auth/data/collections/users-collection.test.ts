import { describe, it, expect } from "vitest";
import {
  UserDocTransformer,
  LuciaUserTransformer,
} from "@/src/auth/data/collections/users-collection";
import { UserModel } from "@/src/auth/domain/models/user-model";
import { ObjectId } from "mongodb";

describe("UserDocTransformer", () => {
  it("transforms UserDoc to UserModel correctly", () => {
    const mockUserDoc = {
      _id: new ObjectId("507f191e810c19729de860ea"),
      email: "test@example.com",
      hashedPassword: "hashedPassword",
      salt: "salt",
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
    const mockLuciaUser = {
      id: "507f191e810c19729de860ea",
      email: "test@example.com",
      hashedPassword: "hashedPassword",
      salt: "salt",
    };
    const transformer = new LuciaUserTransformer(mockLuciaUser);
    const userModel = transformer.toDomain();
    expect(userModel).toBeInstanceOf(UserModel);
    expect(userModel.id).toBe(mockLuciaUser.id);
    expect(userModel.email).toBe(mockLuciaUser.email);
  });
});
