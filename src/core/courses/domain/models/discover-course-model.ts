export interface DiscoverCourseModelData {
  id: string;
  name: string;
  description?: string;
  picture?: string;
  tags?: string[];
}

export class DiscoverCourseModel {
  constructor(readonly data: DiscoverCourseModelData) {}

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

  get tags() {
    return this.data.tags ?? [];
  }
}
