import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./wysiwyg-input.css";

interface WysiwygInputProps {
  name: string;
  id?: string;
  placeholder?: string;

  value: string;
  onChange: (content: string) => void;
}

export function WysiwygInput({
  name,
  id,
  placeholder,
  value,
  onChange,
}: WysiwygInputProps) {
  const editor = useEditor({
    extensions: [StarterKit, Placeholder.configure({ placeholder })],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return <EditorContent name={name} id={id} editor={editor} />;
}
