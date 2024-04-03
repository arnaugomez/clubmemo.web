import { collection } from "@/src/core/app/utils/mongo";

interface TagDoc {
  name: string;
}

export const tagsCollection = collection<TagDoc>("tags");
