"use client";
import { CourseModel } from "@/src/core/courses/domain/models/course-model";
import { PracticeCardModel } from "@/src/core/practice/domain/models/practice-card-model";
import { ReactContextNotFoundError } from "@/src/ui/models/context-errors";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface PracticeProviderProps extends PropsWithChildren {
  course: CourseModel;
  cards: PracticeCardModel[];
}

type State = {
  cards: PracticeCardModel[];
  // TODO: add the task queue
};
// Create the context
const PracticeContext = createContext<
  [State, Dispatch<SetStateAction<State>>] | null
>(null);

// Create the provider component
export function PracticeProvider({ cards, children }: PracticeProviderProps) {
  const a = useState<State>({
    cards,
  });
  return (
    <PracticeContext.Provider value={a}>{children}</PracticeContext.Provider>
  );
}

export function usePracticeContext() {
  const context = useContext(PracticeContext);
  if (!context) throw new ReactContextNotFoundError();
  return context;
}
