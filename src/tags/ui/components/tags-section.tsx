import { Badge, BadgeProps } from "@/src/common/ui/components/shadcn/ui/badge";

interface TagsSectionProps {
  variant?: BadgeProps["variant"];
  tags: string[];
}
export function TagsSection({ tags, variant }: TagsSectionProps) {
  if (!tags.length) return null;
  return (
    <div className="flex flex-wrap gap-2 pt-6">
      {tags.map((tag) => (
        <Badge key={tag} variant={variant}>
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
