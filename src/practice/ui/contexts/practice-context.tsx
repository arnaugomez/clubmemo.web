"use client";
import { ActionResponseHandler } from "@/src/common/ui/models/action-response-handler";
import {
  createContextHook,
  createNullContext,
} from "@/src/common/ui/utils/context";
import type { CourseEnrollmentModel } from "@/src/courses/domain/models/course-enrollment-model";
import type { CourseModel } from "@/src/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/practice/domain/models/practice-card-model";
import type {
  DaysToNextReviewModel,
  PracticeCardRatingModel,
} from "@/src/practice/domain/models/practice-card-rating-model";
import type {
  PracticeResultModel} from "@/src/practice/domain/models/practicer-model";
import {
  PracticerModel,
} from "@/src/practice/domain/models/practicer-model";
import type { ReviewLogModel } from "@/src/practice/domain/models/review-log-model";
import type { PropsWithChildren} from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { getNextPracticeCardsAction } from "../actions/get-next-practice-cards-action";
import { practiceAction } from "../actions/practice-action";
import type { Task} from "./task-queue-context";
import { useTaskQueueContext } from "./task-queue-context";

interface PracticeProviderProps extends PropsWithChildren {
  course: CourseModel;
  enrollment: CourseEnrollmentModel;
  cards: PracticeCardModel[];
}

type State = {
  cards: PracticeCardModel[];
  currentCardIndex: number;
  reviewLogs: ReviewLogModel[];
  nextCards: PracticeCardModel[];
};

interface PracticeContextValue {
  currentCard: PracticeCardModel | null;
  progress: number;
  daysToNextReview: DaysToNextReviewModel;
  rate: (rating: PracticeCardRatingModel) => void;
  canStartNextPractice: boolean;
  startNextPractice: () => void;
}

const PracticeContext = createNullContext<PracticeContextValue>();

export function PracticeProvider({
  course,
  enrollment,
  cards,
  children,
}: PracticeProviderProps) {
  const { addTask } = useTaskQueueContext();
  const [state, setState] = useState<State>({
    cards,
    currentCardIndex: 0,
    reviewLogs: [],
    nextCards: [],
  });

  const currentCard: PracticeCardModel | null =
    state.cards[state.currentCardIndex] || null;

  const practicer = useMemo(() => {
    if (!currentCard) return null;
    const practicer = new PracticerModel({
      card: currentCard,
      enrollment,
    });
    practicer.practice();
    return practicer;
  }, [enrollment, currentCard]);

  async function getNextPracticeCards() {
    const cards = await getNextPracticeCardsAction({ courseId: course.id });
    setState((state) => ({
      ...state,
      nextCards: cards.map((c) => new PracticeCardModel(c)),
    }));
  }

  const rate = async (rating: PracticeCardRatingModel) => {
    if (!practicer) return;
    const practiceResult = practicer.rate(rating);
    addTask(
      practiceResult,
      async (payload, tasks) => {
        const { cards, currentCardIndex } = state;
        const { card, reviewLog } = payload;
        const cardJson = JSON.parse(JSON.stringify(card.data));
        cardJson.due = new Date(cardJson.due);
        cardJson.lastReview = new Date(cardJson.lastReview);
        const response = await practiceAction({
          courseId: course.id,
          card: cardJson,
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
                }
              }
              return state;
            });
            for (const task of tasks as Task<PracticeResultModel>[]) {
              if (task.payload.card.data.provisionalId === provisionalId) {
                task.payload.card.data.id = newCard.id;
                task.payload.card.data.provisionalId = undefined;
              }
            }
          }
          reviewLog.data.id = handler.data.reviewLog.id;
          reviewLog.data.cardId = handler.data.reviewLog.cardId;
          if (currentCardIndex === cards.length - 1) {
            await getNextPracticeCards();
          }
        }
      },
      () => {
        toast.error("Error al guardar los cambios. Reintentando...");
      },
    );

    if (practiceResult.card.data.scheduledDays === 0) {
      state.cards.push(practiceResult.card);
    }
    setState((state) => ({
      ...state,
      currentCardIndex: state.currentCardIndex + 1,
      reviewLogs: state.reviewLogs.concat(practiceResult.reviewLog),
    }));
  };

  function startNextPractice() {
    setState((state) => ({
      cards: state.nextCards,
      currentCardIndex: 0,
      reviewLogs: [],
      nextCards: [],
    }));
  }

  return (
    <PracticeContext.Provider
      value={{
        currentCard,
        progress: state.currentCardIndex / state.cards.length,
        daysToNextReview:
          practicer?.getDaysToNextReview() ??
          PracticerModel.emptyDaysToNextReview,
        rate,
        canStartNextPractice: state.nextCards.length > 0,
        startNextPractice,
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
}

export const usePracticeContext = createContextHook(PracticeContext);
