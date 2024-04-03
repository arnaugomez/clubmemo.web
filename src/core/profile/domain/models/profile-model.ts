export interface ProfileModelData {
  id: string;
  userId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  picture?: string;
  backgroundPicture?: string;
  website?: string;
  isPublic: boolean;
  tags?: string[];
}

export class ProfileModel {
  constructor(readonly data: ProfileModelData) {}

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
  get website() {
    return this.data.website;
  }
  get isPublic() {
    return this.data.isPublic;
  }
  get tags() {
    return this.data.tags ?? [];
  }
}
