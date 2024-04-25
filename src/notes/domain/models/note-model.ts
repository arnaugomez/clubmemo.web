export interface NoteModelData {
  id: string;
  courseId: string;
  front: string;
  back: string;
  createdAt: Date;
}

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

  get createdAt() {
    return this.data.createdAt;
  }
}
