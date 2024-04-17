import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough } from "lucide-react";
import { cn } from "../../utils/shadcn";
import { Card } from "../shadcn/ui/card";
import { Toggle } from "../shadcn/ui/toggle";
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
    <>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <Card className="flex space-x-1 p-0.5">
            <Toggle
              type="button"
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
              pressed={editor.isActive("bold")}
              aria-label="Negrita"
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              type="button"
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
              pressed={editor.isActive("italic")}
              aria-label="Cursiva"
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              type="button"
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
              pressed={editor.isActive("strike")}
              aria-label="Rayado"
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
          </Card>
        </BubbleMenu>
      )}
      <EditorContent className="wysiwyg" name={name} id={id} editor={editor} />
    </>
  );
}
