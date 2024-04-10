import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/core/practice/domain/models/practice-card-model";
import { PracticeCardRatingModel } from "@/src/core/practice/domain/models/practice-card-rating-model";
import { PracticerModel } from "@/src/core/practice/domain/models/practicer-model";

interface PracticeContentProps {
  course: CourseModel;
}
export function PracticeContent({ course }: PracticeContentProps) {
  if (!course.enrollment) throw Error("Course enrollment is required");

  const newCard = PracticeCardModel.createNew({
    courseEnrollmentId: course.enrollment.id,
    noteId: "",
  });
  const practicer = new PracticerModel({
    card: newCard,
    enrollment: course.enrollment,
  });
  const result = practicer.practice(PracticeCardRatingModel.easy);
  console.log(result);
  return <></>;
}
