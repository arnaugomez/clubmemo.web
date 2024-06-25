/**
 * Data that can be entered by the user to update their profile.
 */
export interface UpdateProfileInputModel {
  /**
   * The id of the profile to update.
   */
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
