"use client";
import { CourseModelData } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModelData } from "@/src/core/practice/domain/models/practice-card-model";

interface PracticeManagerProps {
  course: CourseModelData;
  cards: PracticeCardModelData[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PracticeWizard({ course, cards }: PracticeManagerProps) {
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
