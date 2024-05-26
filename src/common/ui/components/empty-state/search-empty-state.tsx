import { SearchX } from "lucide-react";
import { textStyles } from "../../styles/text-styles";

interface SearchEmptyStateProps {
  icon?: React.ReactNode;
}

export function SearchEmptyState({icon}: SearchEmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center">
      {icon || <SearchX className="size-6 text-slate-500" />}
      <div className="h-3"></div>
      <p className={textStyles.muted}>No hay resultados</p>
    </div>
  );
}
