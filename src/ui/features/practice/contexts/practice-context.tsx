"use client";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/core/practice/domain/models/practice-card-model";
import { DaysToNextReviewModel } from "@/src/core/practice/domain/models/practice-card-rating-model";
import { PracticerModel } from "@/src/core/practice/domain/models/practicer-model";
import { ReviewLogModel } from "@/src/core/practice/domain/models/review-log-model";
import { ReactContextNotFoundError } from "@/src/ui/models/context-errors";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface PracticeProviderProps extends PropsWithChildren {
  course: CourseModel;
  cards: PracticeCardModel[];
}

type State = {
  cards: PracticeCardModel[];
  currentCardIndex: number;
  reviewLogs: ReviewLogModel[];
};

interface PracticeContextValue {
  currentCard: PracticeCardModel | null;
  daysToNextReview: DaysToNextReviewModel;
}
// Create the context
const PracticeContext = createContext<PracticeContextValue | null>(null);

// Create the provider component
export function PracticeProvider({
  course,
  cards,
  children,
}: PracticeProviderProps) {
  const [state] = useState<State>({
    cards,
    currentCardIndex: 0,
    reviewLogs: [],
  });

  const currentCard = state.cards[state.currentCardIndex] || null;

  const practicer = useMemo(() => {
    if (!course.enrollment) throw new Error("Enrollment is required");
    const practicer = new PracticerModel({
      card: currentCard,
      enrollment: course.enrollment,
    });
    practicer.practice();
    return practicer;
  }, [course.enrollment, currentCard]);

  const daysToNextReview = practicer.getDaysToNextReview();

  return (
    <PracticeContext.Provider value={{ currentCard, daysToNextReview }}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePracticeContext() {
  const context = useContext(PracticeContext);
  if (!context) throw new ReactContextNotFoundError();
  return context;
}
