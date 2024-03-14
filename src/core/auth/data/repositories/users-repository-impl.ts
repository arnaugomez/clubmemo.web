import { MongoService } from "@/src/core/app/domain/interfaces/mongo-service";
import { Collection } from "mongodb";
import {
  UpdatePasswordModel,
  UsersRepository,
} from "../../domain/interfaces/users-repository";
import { UserModel } from "../../domain/models/user-model";
import {
  UserDoc,
  userTransformer,
  usersCollection,
} from "../collections/users-collection";

export class UsersRepositoryImpl implements UsersRepository {
  private readonly usersCollection: Collection<UserDoc>;

  constructor(mongoService: MongoService) {
    this.usersCollection = mongoService.collection(usersCollection);
  }

  async getByEmail(email: string): Promise<UserModel | null> {
    const doc = await this.usersCollection.findOne({ email });
    return doc && userTransformer(doc);
  }

  async updatePassword({
    userId,
    password,
  }: UpdatePasswordModel): Promise<void> {
    await this.usersCollection.updateOne(
      { _id: userId },
      { $set: { password } },
    );
  }
}
