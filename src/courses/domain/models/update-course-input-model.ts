export interface UpdateCourseInputModel {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  picture?: string;
  tags: string[];
}
