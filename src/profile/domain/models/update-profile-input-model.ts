export interface UpdateProfileInputModel {
  id: string;

  displayName: string;
  handle: string;
  bio: string;
  website: string;
  isPublic: boolean;
  picture?: string;
  backgroundPicture?: string;
  tags: string[];
}
