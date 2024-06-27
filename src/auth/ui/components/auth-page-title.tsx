import { textStyles } from "@/src/common/ui/styles/text-styles";

interface AuthPageTitleProps {
  title: string;
  description?: string;
}
/**
 * Reusable component that shows the title and description of the page.
 * Used in the authentication pages to give them a consistent look.
 */
export function AuthPageTitle({ title, description }: AuthPageTitleProps) {
  return (
    <>
      <h1 className={textStyles.h2}>{title}</h1>
      {description && (
        <>
          <div className="h-2"></div>
          <p>{description}</p>
        </>
      )}
    </>
  );
}
