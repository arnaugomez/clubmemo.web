export interface CourseModelData {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  isPublic: boolean;
}

export class CourseModel {
  constructor(readonly data: CourseModelData) {}

  get id() {
    return this.data.id;
  }

  get name() {
    return this.data.name;
  }

  get description() {
    return this.data.description;
  }

  get picture() {
    return this.data.picture;
  }

  get isPublic() {
    return this.data.isPublic;
  }
}
