import type { Context } from "react";
import { createContext, useContext } from "react";
import { ReactContextNotFoundError } from "../models/context-errors";

export const createNullContext = <T>() => createContext<T | null>(null);

export function createContextHook<T>(context: Context<T | null>) {
  return () => {
    const value = useContext(context);
    if (!value) throw new ReactContextNotFoundError();
    return value;
  };
}
