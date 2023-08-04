import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>This content is editable!</p>",
  });

  return (
    <div className="p-24">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
