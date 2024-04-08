import { Badge, BadgeProps } from "@/src/ui/components/shadcn/ui/badge";

interface TagsSectionProps {
  variant?: BadgeProps["variant"];
  tags: string[];
}
export function TagsSection({ tags, variant }: TagsSectionProps) {
  if (!tags.length) return null;
  return (
    <div className="pt-6 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant={variant}>
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
