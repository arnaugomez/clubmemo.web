import { collection } from "@/src/common/data/utils/mongodb";

/**
 * Data of a tag as it is stored in the database.
 */
interface TagDoc {
  name: string;
}

export const tagsCollection = collection<TagDoc>()("tags");
