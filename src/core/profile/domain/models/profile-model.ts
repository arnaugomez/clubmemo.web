import { ObjectId } from "mongodb";

interface ProfileModelData {
  id: ObjectId;
  userId: ObjectId;
  displayName?: string;
  handle?: string;
  bio?: string;
  picture?: string;
  backgroundPicture?: string;
}

export class ProfileModel {
  constructor(private readonly data: ProfileModelData) {}

  get id() {
    return this.data.id;
  }
  get userId() {
    return this.data.userId;
  }
  get displayName() {
    return this.data.displayName;
  }
  get handle() {
    return this.data.handle;
  }
  get bio() {
    return this.data.bio;
  }
  get picture() {
    return this.data.picture;
  }
  get backgroundPicture() {
    return this.data.backgroundPicture;
  }
}
