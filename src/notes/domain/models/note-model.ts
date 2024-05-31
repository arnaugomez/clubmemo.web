export interface NoteModelData {
  id: string;
  courseId: string;
  front: string;
  back: string;
  frontText?: string;
  backText?: string;
  createdAt: Date;
}

/**
 * A note of a course.
 * Contains a front text (the question) and a back text (the answer).
 *
 * A note is not the same thing as a card. A note contains the learning content
 * (question and answer, front and back) that the learner must memorize. A card
 * is generated from a note, and contains the status of the learner's
 * memorization process. The card keeps track of the learner's progress and its
 * data determines the next time the learner should practice the note.
 * To learn more about cards, see the `PracticeCardModel` class.
 *
 * There can be multiple cards for a single note. If 3 users are learning the
 * same note, there will be 3 cards, one for each user.
 */
export class NoteModel {
  constructor(readonly data: NoteModelData) {}

  get id() {
    return this.data.id;
  }
  get courseId() {
    return this.data.courseId;
  }
  get front() {
    return this.data.front;
  }
  get back() {
    return this.data.back;
  }

  get frontText() {
    return this.data.frontText;
  }
  get backText() {
    return this.data.backText;
  }

  get createdAt() {
    return this.data.createdAt;
  }
}
