import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import { useEffect, useRef } from 'react';
import EditorToolbar from './editor/EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  showSource?: boolean;
}

const RichTextEditor = ({ 
  content, 
  onChange, 
  editable = true,
  showSource = false,
}: RichTextEditorProps) => {
  const initialContent = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        bold: false,
        italic: false,
        code: false,
        codeBlock: false,
        blockquote: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Bold,
      Italic,
      Underline,
      Code,
      CodeBlock,
      Blockquote,
      ListItem,
      BulletList,
      OrderedList,
    ],
    content: initialContent.current,
    editable,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML();
        onChange(html);
      }
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} editable={editable} />
      <div className="prose max-w-none p-4">
        <EditorContent editor={editor} />
      </div>
      {showSource && (
        <div className="border-t p-4 bg-gray-50">
          <div className="font-mono text-sm bg-white p-2 rounded border overflow-auto max-h-40">
            {editor.getHTML()}
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;