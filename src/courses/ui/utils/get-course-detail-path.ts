export function getCourseDetailPath(courseId: string) {
  if (!courseId) throw new Error("courseId should not be empty");
  return `/courses/detail/${courseId}`;
}
