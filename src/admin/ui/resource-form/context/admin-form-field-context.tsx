import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext } from "react";

interface AdminFormFieldContextValue {
  prefix: string;
  getName: (name: string) => string;
}

const AdminFormFieldContext = createContext<AdminFormFieldContextValue>({
  prefix: "",
  getName: (name: string) => name,
});

interface AdminFormFieldProviderProps extends PropsWithChildren {
  prefix: string;
}

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

export function useAdminFormFieldContext() {
  return useContext(AdminFormFieldContext);
}
