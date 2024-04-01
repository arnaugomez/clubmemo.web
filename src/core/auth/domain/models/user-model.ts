import { AuthTypeModel } from "./auth-type-model";

interface UserModelData {
  id: string;
  email: string;
  authTypes: AuthTypeModel[];
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
