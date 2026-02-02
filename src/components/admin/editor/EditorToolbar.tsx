import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { FontSelector } from "./FontSelector";
import { ColorPicker } from "./ColorPicker";
import { HighlightPicker } from "./HighlightPicker";

interface EditorToolbarProps {
  editor: Editor;
  onSetLink: () => void;
}

export const EditorToolbar = ({ editor, onSetLink }: EditorToolbarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-0.5 bg-muted/50 border-b border-border px-2 py-1.5">
      {/* Undo/Redo */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        title="Desfazer"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        title="Refazer"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Font Family */}
      <FontSelector editor={editor} />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Text formatting */}
      <Button
        type="button"
        variant={editor.isActive("bold") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrito (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("italic") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Itálico (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("underline") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Sublinhado (Ctrl+U)"
      >
        <UnderlineIcon className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Colors */}
      <ColorPicker editor={editor} />
      <HighlightPicker editor={editor} />

      <div className="w-px h-6 bg-border mx-1" />

      {/* Headings */}
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Título 1"
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Título 2"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Título 3"
      >
        <Heading3 className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Lists */}
      <Button
        type="button"
        variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista com marcadores"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Citação"
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        title="Alinhar à esquerda"
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        title="Centralizar"
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        title="Alinhar à direita"
      >
        <AlignRight className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant={editor.isActive({ textAlign: "justify" }) ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        title="Justificar"
      >
        <AlignJustify className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Link and HR */}
      <Button
        type="button"
        variant={editor.isActive("link") ? "secondary" : "ghost"}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={onSetLink}
        title="Inserir link"
      >
        <Link className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Linha horizontal"
      >
        <Minus className="w-4 h-4" />
      </Button>
    </div>
  );
};
