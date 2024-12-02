import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
}

const RichTextEditor = ({ content, onChange, editable = false }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;