import { collection } from "@/src/common/data/utils/mongo";

interface TagDoc {
  name: string;
}

export const tagsCollection = collection<TagDoc>("tags");
