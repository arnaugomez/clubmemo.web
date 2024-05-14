import type { NoteDoc } from "@/src/notes/data/collections/notes-collection";
import type { WithId } from "mongodb";
import type { PracticeCardDoc } from "./practice-cards-collection";
import { PracticeCardDocTransformer } from "./practice-cards-collection";

export interface PracticeCardAggregationDoc extends WithId<PracticeCardDoc> {
  note: WithId<NoteDoc>;
}

export class PracticeCardAggregationDocTransformer {
  constructor(private readonly doc: PracticeCardAggregationDoc) {}

  toDomain() {
    return new PracticeCardDocTransformer(this.doc).toDomain(this.doc.note);
  }
}
