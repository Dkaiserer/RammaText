import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Start typing...</p>",
  });

  if (!editor) return null;

  return (
    <div className="p-4">
      <EditorContent editor={editor} />
    </div>
  );
}