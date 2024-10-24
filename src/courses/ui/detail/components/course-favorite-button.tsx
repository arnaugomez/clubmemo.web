import { DropdownMenuItem } from "@/src/common/ui/components/shadcn/ui/dropdown-menu";
import { FormResponseHandler } from "@/src/common/ui/models/server-form-errors";
import { Bookmark } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { favoriteCourseAction } from "../actions/favorite-course-action";
import { locator_common_ErrorTrackingService } from "@/src/common/locators/locator_error-tracking-service";
import { toast } from "sonner";

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
      try {
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
      } catch (error) {
        locator_common_ErrorTrackingService().captureError(error)
        toast.error("Ha ocurrido un error")
      }
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
