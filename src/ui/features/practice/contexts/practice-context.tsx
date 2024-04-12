"use client";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/core/practice/domain/models/practice-card-model";
import {
  DaysToNextReviewModel,
  PracticeCardRatingModel,
} from "@/src/core/practice/domain/models/practice-card-rating-model";
import { PracticerModel } from "@/src/core/practice/domain/models/practicer-model";
import { ReviewLogModel } from "@/src/core/practice/domain/models/review-log-model";
import { ActionResponseHandler } from "@/src/ui/models/action-response-handler";
import { createContextHook, createNullContext } from "@/src/ui/utils/context";
import { PropsWithChildren, useMemo, useState } from "react";
import { toast } from "sonner";
import { practiceAction } from "../actions/practice-action";
import { useTaskQueueContext } from "./task-queue-context";

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
  progress: number;
  daysToNextReview: DaysToNextReviewModel;
  rate: (rating: PracticeCardRatingModel) => void;
}

const PracticeContext = createNullContext<PracticeContextValue>();

export function PracticeProvider({
  course,
  cards,
  children,
}: PracticeProviderProps) {
  const { addTask } = useTaskQueueContext();
  const [state, setState] = useState<State>({
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

  const rate = (rating: PracticeCardRatingModel) => {
    const { card, reviewLog } = practicer.rate(rating);
    addTask(
      async () => {
        const response = await practiceAction({
          courseId: course.id,
          card: card.data,
          reviewLog: reviewLog.data,
        });
        const handler = new ActionResponseHandler(response);
        if (handler.hasErrors) {
          throw new Error();
        }
        if (handler.data) {
          const newCard = handler.data.card;
          const provisionalId = card.data.provisionalId;
          if (provisionalId) {
            setState((state) => {
              for (const item of state.cards) {
                if (item.data.provisionalId === provisionalId) {
                  item.data.id = newCard.id;
                  item.data.provisionalId = undefined;
                  break;
                }
              }
              return state;
            });
          }
          reviewLog.data.id = handler.data.reviewLog.id;
          reviewLog.data.cardId = handler.data.reviewLog.cardId;
        }
      },
      () => {
        toast.error("Error al guardar los cambios. Reintentando...");
      },
    );

    if (card.data.scheduledDays === 0) {
      state.cards.push(card);
    }
    setState((state) => ({
      ...state,
      currentCardIndex: state.currentCardIndex + 1,
      reviewLogs: state.reviewLogs.concat(reviewLog),
    }));
  };

  return (
    <PracticeContext.Provider
      value={{
        currentCard,
        progress: state.currentCardIndex / state.cards.length,
        daysToNextReview: practicer.getDaysToNextReview(),
        rate,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export const usePracticeContext = createContextHook(PracticeContext);
