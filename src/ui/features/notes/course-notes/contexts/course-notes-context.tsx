"use client";
import { NoteModel } from "@/src/core/notes/domain/models/note-model";
import { ReactContextNotFoundError } from "@/src/ui/models/context-errors";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type State = NoteModel[];
// Create the context
const CourseNotesContext = createContext<
  [State, Dispatch<SetStateAction<State>>] | null
>(null);

// Create the provider component
export function CourseNotesProvider({ children }: PropsWithChildren) {
  const a = useState<State>([]);
  return (
    <CourseNotesContext.Provider value={a}>
      {children}
    </CourseNotesContext.Provider>
  );
}

export function useCourseNotesContext() {
  const context = useContext(CourseNotesContext);
  if (!context) throw new ReactContextNotFoundError();
  return context;
}
