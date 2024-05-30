import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseEnrollmentConfigModel } from "@/src/courses/domain/models/course-enrollment-config-model";
import type { DaysToNextReviewModel } from "@/src/practice/domain/models/practice-card-rating-model";
import { PracticeCardRatingModel } from "@/src/practice/domain/models/practice-card-rating-model";
import type { PropsWithChildren } from "react";

interface PracticeOption {
  label: string;
  rating: PracticeCardRatingModel;
  isAdvanced?: boolean;
}

const practiceOptions: PracticeOption[] = [
  { label: "Repetir", rating: PracticeCardRatingModel.again },
  { label: "Difícil", rating: PracticeCardRatingModel.hard, isAdvanced: true },
  { label: "Bien", rating: PracticeCardRatingModel.good },
  { label: "Fácil", rating: PracticeCardRatingModel.easy, isAdvanced: true },
];

interface PracticeActionsBarProps {
  showBack: boolean;
  onShowBack: () => void;
  onRate: (rating: PracticeCardRatingModel) => void;
  enrollmentConfig: CourseEnrollmentConfigModel;
  daysToNextReview: DaysToNextReviewModel;
}
export function PracticeActionsBar({
  showBack,
  onShowBack,
  onRate,
  enrollmentConfig,
  daysToNextReview,
}: PracticeActionsBarProps) {
  function buildContent() {
    if (showBack) {
      return (
        <>
          {practiceOptions
            .filter(
              (o) =>
                !o.isAdvanced || enrollmentConfig.showAdvancedRatingOptions,
            )
            .map((o) => (
              <RateButton
                key={o.rating}
                onClick={() => onRate(o.rating)}
                days={daysToNextReview[o.rating]}
              >
                {o.label}
              </RateButton>
            ))}
        </>
      );
    }
    return (
      <ButtonWithBottomText className="max-w-xs" onClick={onShowBack}>
        Mostrar respuesta
      </ButtonWithBottomText>
    );
  }
  return (
    <div className="flex flex-none justify-center space-x-4 border-t-[1px] border-t-slate-200 p-4 pb-2">
      {buildContent()}
    </div>
  );
}
interface RateButtonProps extends PropsWithChildren {
  days?: number;
  onClick(): void;
}

function RateButton({ onClick, days, children }: RateButtonProps) {
  return (
    <ButtonWithBottomText
      onClick={onClick}
      bottomText={days ? `${days} días` : undefined}
    >
      {children}
    </ButtonWithBottomText>
  );
}

interface ButtonWithBottomText extends PropsWithChildren {
  onClick: () => void;
  bottomText?: string;
  className?: string;
}

function ButtonWithBottomText({
  children,
  onClick,
  bottomText,
  className,
}: ButtonWithBottomText) {
  return (
    <div
      className={cn("flex max-w-24 flex-1 flex-col items-stretch", className)}
    >
      <Button onClick={onClick}>{children}</Button>
      <div className="h-2"></div>
      <div className={cn(textStyles.muted, "text-center")}>
        {bottomText ?? <>&nbsp;</>}
      </div>
    </div>
  );
}
