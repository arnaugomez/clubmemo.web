import { LinkIcon } from "lucide-react";

interface WebsiteLinkProps {
  url: string;
}
export function WebsiteLink({ url }: WebsiteLinkProps) {
  return (
    <a
      href={url}
      className="flex max-w-xs items-center pt-4 text-muted-foreground underline hover:text-slate-900"
    >
      <LinkIcon className="mr-2 size-4 flex-none" />
      <span className="truncate text-sm">
        {url.replace(/(^\w+:|^)\/\//, "")}
      </span>
    </a>
  );
}
