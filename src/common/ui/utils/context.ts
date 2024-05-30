import { CourseDoesNotExistError } from "@/src/courses/domain/models/course-errors";
import type { Context } from "react";
import { createContext, useContext } from "react";

export const createNullContext = <T>() => createContext<T | null>(null);

export function createContextHook<T>(context: Context<T | null>) {
  return () => {
    const value = useContext(context);
    if (!value) throw new CourseDoesNotExistError();
    return value;
  };
}
