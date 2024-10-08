"use client";

import type { AdminResourceTypeModel } from "@/src/admin/domain/models/admin-resource-model";
import { translateAdminKey } from "@/src/admin/ui/i18n/admin-translations";
import { ObjectIdSchema } from "@/src/common/schemas/object-id-schema";
import { Button } from "@/src/common/ui/components/shadcn/ui/button";
import type { InputProps } from "@/src/common/ui/components/shadcn/ui/input";
import { Input } from "@/src/common/ui/components/shadcn/ui/input";
import { CopyIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";
import { useClipboard } from "../../hooks/use-clipboard";
import { textStyles } from "../../styles/text-styles";
import { cn } from "../../utils/shadcn";

interface ObjectIdInputProps extends InputProps {
  resourceType?: AdminResourceTypeModel;
}

const ObjectIdInput = forwardRef<HTMLInputElement, ObjectIdInputProps>(
  ({ className, resourceType, ...props }, ref) => {
    const { copyToClipboard } = useClipboard();

    const { value } = props;
    const { success: isValidObjectId } = ObjectIdSchema.safeParse(value);

    function renderLink() {
      if (!resourceType) return null;

      const linkText = `${isValidObjectId ? "Ver" : "Buscar"} ${translateAdminKey(resourceType, "singular")}`;

      return (
        <>
          <div className="h-1" />
          <Link
            href={`/admin/resources/${resourceType}${isValidObjectId ? `/detail/${value}` : ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(textStyles.mutedLink, "mt-1")}
          >
            {linkText}
            <ExternalLinkIcon
              size={14}
              className="ml-1 inline -translate-y-px"
            />
          </Link>
        </>
      );
    }

    return (
      <div>
        <div className="relative">
          <Input
            type="text"
            className={cn("pr-10", className)}
            ref={ref}
            {...props}
          />
          {value && isValidObjectId && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => copyToClipboard(value.toString() ?? "")}
              disabled={props.disabled}
            >
              <CopyIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Copy ID to clipboard</span>
            </Button>
          )}
        </div>
        {renderLink()}
      </div>
    );
  },
);
ObjectIdInput.displayName = "ObjectIdInput";

export { ObjectIdInput };
