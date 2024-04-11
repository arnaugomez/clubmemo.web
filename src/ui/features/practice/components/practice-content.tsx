import { CourseModel } from "@/src/core/courses/domain/models/course-model";

interface PracticeContentProps {
  course: CourseModel;
}
export function PracticeContent({ course }: PracticeContentProps) {
  if (!course.enrollment) throw Error("Course enrollment is required");

  // const newCard = PracticeCardModel.createNew({
  //   courseEnrollmentId: course.enrollment.id,
  //   note: "",
  // });
  // const practicer = new PracticerModel({
  //   card: newCard,
  //   enrollment: course.enrollment,
  // });
  // const result = practicer.practice(PracticeCardRatingModel.easy);
  // console.log(result);
  return <></>;
}
