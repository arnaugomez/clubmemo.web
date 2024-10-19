import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext } from "react";

interface AdminFormFieldContextValue {
  prefix: string;
  getName: (name: string) => string;
}

/**
 * Holds data of the field that contains another field. Used in nested fields.
 */
const AdminFormFieldContext = createContext<AdminFormFieldContextValue>({
  prefix: "",
  getName: (name: string) => name,
});

interface AdminFormFieldProviderProps extends PropsWithChildren {
  prefix: string;
}

/**
 * Used with fields that contain nested fields, to provide the prefix for the
 * field names to the nested fields.
 */
export function AdminFormFieldContextProvider({
  prefix,
  children,
}: AdminFormFieldProviderProps) {
  const getName = useCallback(
    (name: string) => (prefix ? `${prefix}.${name}` : name),
    [prefix],
  );
  return (
    <AdminFormFieldContext.Provider value={{ prefix, getName }}>
      {children}
    </AdminFormFieldContext.Provider>
  );
}

/**
 * Returns data of the field that contains the current field
 */
export function useAdminFormFieldContext() {
  return useContext(AdminFormFieldContext);
}
