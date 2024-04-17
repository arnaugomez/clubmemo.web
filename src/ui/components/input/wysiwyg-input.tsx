import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "../../utils/shadcn";
import "./wysiwyg-input.css";

interface WysiwygInputProps {
  name: string;
  id?: string;
  placeholder?: string;

  value: string;
  onChange: (content: string) => void;
  isSmall?: boolean;
}

export function WysiwygInput({
  name,
  id,
  placeholder,
  value,
  onChange,
  isSmall,
}: WysiwygInputProps) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: cn(
          !isSmall && "min-h-[80px]",
          "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ),
      },
    },
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <EditorContent className="wysiwyg" name={name} id={id} editor={editor} />
  );
}
