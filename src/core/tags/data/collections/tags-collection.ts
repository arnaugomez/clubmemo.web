import { collection } from "@/src/core/common/utils/mongo";

interface TagDoc {
  name: string;
}

export const tagsCollection = collection<TagDoc>("tags");
