import { Search } from "lucide-react";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

interface PaginationEmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
}
export function PaginationEmptyState({
  icon = <Search className={cn(textStyles.muted, "size-5")} />,
  title = "No hay más resultados",
}: PaginationEmptyStateProps) {
  return (
    <>
      <div className="flex justify-center pt-16">{icon}</div>
      <div className="h-4"></div>
      <p className={cn(textStyles.muted, "text-center text-sm")}>{title}</p>
    </>
  );
}
