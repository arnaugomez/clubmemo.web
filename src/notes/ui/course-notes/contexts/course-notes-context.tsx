"use client";
import {
  createContextHook,
  createNullContext,
} from "@/src/common/ui/utils/context";
import type { NoteModel } from "@/src/notes/domain/models/note-model";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { useState } from "react";

type State = NoteModel[];

const CourseNotesContext =
  createNullContext<[State, Dispatch<SetStateAction<State>>]>();

export function CourseNotesProvider({ children }: PropsWithChildren) {
  return (
    <CourseNotesContext.Provider value={useState<State>([])}>
      {children}
    </CourseNotesContext.Provider>
  );
}

export const useCourseNotesContext = createContextHook(CourseNotesContext);
