import { collection } from "@/src/core/app/utils/mongo";
import { ObjectId } from "mongodb";

export interface ProfileDoc {
  userId?: ObjectId;
  displayName?: string;
  handle?: string;
  bio?: string;
  picture?: string;
  backgroundPicture?: string;
}

export const profilesCollection = collection<ProfileDoc>("profiles");
