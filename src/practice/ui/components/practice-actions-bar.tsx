import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { cn } from "@/src/common/ui/utils/shadcn";
import type { CourseEnrollmentConfigModel } from "@/src/courses/domain/models/course-enrollment-config-model";
import { PracticeCardRatingModel } from "@/src/practice/domain/models/practice-card-rating-model";
import type { PropsWithChildren } from "react";
import { usePracticeContext } from "../contexts/practice-context";

interface PracticeActionsBarProps {
  showBack: boolean;
  setShowBack: (showBack: boolean) => void;
  enrollmentConfig: CourseEnrollmentConfigModel;
}
export function PracticeActionsBar({
  showBack,
  setShowBack,
  enrollmentConfig,
}: PracticeActionsBarProps) {
  return (
    <div className="flex flex-none justify-center space-x-4 border-t-[1px] border-t-slate-200 p-4 pb-2">
      {!showBack && (
        <ButtonWithBottomText
          className="max-w-xs"
          onClick={() => setShowBack(true)}
        >
          Mostrar respuesta
        </ButtonWithBottomText>
      )}
      {showBack && (
        <>
          <RateButton
            rating={PracticeCardRatingModel.again}
            setShowBack={setShowBack}
          >
            Repetir
          </RateButton>
          {enrollmentConfig.showAdvancedRatingOptions && (
            <RateButton
              rating={PracticeCardRatingModel.hard}
              setShowBack={setShowBack}
            >
              Difícil
            </RateButton>
          )}
          <RateButton
            rating={PracticeCardRatingModel.good}
            setShowBack={setShowBack}
          >
            Bien
          </RateButton>
          {enrollmentConfig.showAdvancedRatingOptions && (
            <RateButton
              rating={PracticeCardRatingModel.easy}
              setShowBack={setShowBack}
            >
              Fácil
            </RateButton>
          )}
        </>
      )}
    </div>
  );
}
interface RateButtonProps extends PropsWithChildren {
  rating: PracticeCardRatingModel;
  setShowBack: (showBack: boolean) => void;
}

function RateButton({ rating, setShowBack, children }: RateButtonProps) {
  const { daysToNextReview, rate } = usePracticeContext();
  return (
    <ButtonWithBottomText
      onClick={() => {
        rate(rating);
        setShowBack(false);
      }}
      bottomText={
        daysToNextReview[rating]
          ? `${daysToNextReview[rating]} días`
          : undefined
      }
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
