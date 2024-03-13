import { UserId } from "lucia";
import { AuthType } from "./auth-type-model";

interface UserModelData {
  id: UserId;
  email: string;
  authTypes: AuthType[];
  isEmailVerified?: boolean;
}

export class UserModel {
  constructor(private data: UserModelData) {}

  get id() {
    return this.data.id;
  }

  get email() {
    return this.data.email;
  }

  get authTypes() {
    return this.data.authTypes;
  }

  get isEmailVerified() {
    return this.data.isEmailVerified;
  }
}
