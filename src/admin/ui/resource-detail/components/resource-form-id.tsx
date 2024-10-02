import { FormItem, FormLabel } from "@/src/common/ui/components/shadcn/ui/form";
import { useClipboard } from "@/src/common/ui/hooks/use-clipboard";
import { textStyles } from "@/src/common/ui/styles/text-styles";
import { CopyIcon } from "lucide-react";

export function ResourceFormId({ id }: { id: string }) {
  const { copyToClipboard } = useClipboard();
  return (
    <FormItem>
      <FormLabel>Identificador del recurso</FormLabel>
      <p className={textStyles.muted}>
        {id}
        <CopyIcon
          className="ml-2 inline-block -translate-y-px cursor-pointer hover:text-slate-900"
          role="button"
          onClick={() => copyToClipboard(id)}
          size={14}
        />
      </p>
    </FormItem>
  );
}
