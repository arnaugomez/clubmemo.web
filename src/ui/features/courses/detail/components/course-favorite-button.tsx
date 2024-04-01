import { DropdownMenuItem } from "@/src/ui/components/shadcn/ui/dropdown-menu";
import { FormResponseHandler } from "@/src/ui/view-models/server-form-errors";
import { Bookmark } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { favoriteCourseAction } from "../actions/favorite-course-action";

interface CourseFavoriteButtonProps {
  courseId: string;
  isFavorite: boolean;
}

export function CourseFavoriteButton(props: CourseFavoriteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(props.isFavorite);
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(
    isFavorite,
    (_, optimistic: boolean) => optimistic,
  );

  function onSelect(e: Event) {
    e.preventDefault();
    if (isPending) return;

    startTransition(async () => {
      setOptimisticFavorite(!isFavorite);
      const response = await favoriteCourseAction({
        courseId: props.courseId,
        isFavorite: !isFavorite,
      });
      const handler = new FormResponseHandler(response);
      if (!handler.hasErrors) {
        setIsFavorite(!isFavorite);
      }
      handler.toastErrors();
    });
  }

  return (
    <>
      <DropdownMenuItem onSelect={onSelect}>
        <Bookmark
          fill={optimisticFavorite ? "currentColor" : "white"}
          className="mr-2 h-4 w-4"
        />
        <span>{optimisticFavorite ? "Destacado" : "Destacar"}</span>
      </DropdownMenuItem>
    </>
  );
}
