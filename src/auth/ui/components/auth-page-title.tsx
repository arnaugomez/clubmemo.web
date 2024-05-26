import { textStyles } from "@/src/common/ui/styles/text-styles";

interface AuthPageTitleProps {
  title: string;
  description?: string;
}
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
