import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect, useCallback } from "react";
import { EditorToolbar } from "./editor/EditorToolbar";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline cursor-pointer",
        },
      }),
      FontFamily,
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] p-6 focus:outline-none " +
          "prose-headings:font-display prose-headings:text-foreground " +
          "prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 " +
          "prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 " +
          "prose-h3:text-lg prose-h3:font-medium prose-h3:mb-2 " +
          "prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-3 " +
          "prose-strong:text-foreground prose-strong:font-bold " +
          "prose-ul:my-4 prose-ul:pl-6 prose-ol:my-4 prose-ol:pl-6 " +
          "prose-li:mb-1 prose-li:text-foreground " +
          "prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:italic",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="relative border border-border rounded-lg overflow-hidden bg-background">
      <EditorToolbar editor={editor} onSetLink={setLink} />
      
      <div className="relative">
        <EditorContent editor={editor} />
        
        {!value && placeholder && (
          <div className="absolute top-6 left-6 text-muted-foreground pointer-events-none text-sm">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
