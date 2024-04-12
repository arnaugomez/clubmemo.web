import { NoteDoc } from "@/src/core/notes/data/collections/notes-collection";
import { WithId } from "mongodb";
import {
  PracticeCardDoc,
  PracticeCardDocTransformer,
} from "./practice-cards-collection";

export interface PracticeCardAggregationDoc extends WithId<PracticeCardDoc> {
  note: WithId<NoteDoc>;
}

export class PracticeCardAggregationDocTransformer {
  constructor(private readonly doc: PracticeCardAggregationDoc) {}

  toDomain() {
    return new PracticeCardDocTransformer(this.doc).toDomain(this.doc.note);
  }
}
