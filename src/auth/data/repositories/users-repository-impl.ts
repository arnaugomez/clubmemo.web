import type { DatabaseService } from "@/src/common/domain/interfaces/database-service";
import { ObjectId } from "mongodb";
import type { UsersRepository } from "../../domain/interfaces/users-repository";
import type { UserModel } from "../../domain/models/user-model";
import {
  UserDocTransformer,
  usersCollection,
} from "../collections/users-collection";

/**
 * Implementation of `UsersRepository` with the MongoDB database
 */
export class UsersRepositoryImpl implements UsersRepository {
  private readonly usersCollection: typeof usersCollection.type;

  constructor(databaseService: DatabaseService) {
    this.usersCollection = databaseService.collection(usersCollection);
    this.usersCollection.createIndex({ email: 1 }, { unique: true });
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    const doc = await this.usersCollection.findOne({ email });
    return doc && new UserDocTransformer(doc).toDomain();
  }

  async delete(id: string): Promise<void> {
    await this.usersCollection.deleteOne({ _id: new ObjectId(id) });
  }
}
