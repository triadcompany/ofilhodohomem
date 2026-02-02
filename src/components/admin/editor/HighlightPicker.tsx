import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Highlighter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HighlightPickerProps {
  editor: Editor;
}

const HIGHLIGHT_COLORS = [
  { name: "Amarelo", value: "#fef08a" },
  { name: "Verde", value: "#bbf7d0" },
  { name: "Azul", value: "#bfdbfe" },
  { name: "Rosa", value: "#fbcfe8" },
  { name: "Roxo", value: "#ddd6fe" },
  { name: "Laranja", value: "#fed7aa" },
];

export const HighlightPicker = ({ editor }: HighlightPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={editor.isActive("highlight") ? "secondary" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          title="Destacar texto"
        >
          <Highlighter className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-3 gap-1">
          {HIGHLIGHT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() =>
                editor.chain().focus().toggleHighlight({ color: color.value }).run()
              }
              className="w-8 h-6 rounded border border-border hover:scale-105 transition-transform text-xs"
              style={{ backgroundColor: color.value }}
              title={color.name}
            >
              A
            </button>
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => editor.chain().focus().unsetHighlight().run()}
        >
          Remover destaque
        </Button>
      </PopoverContent>
    </Popover>
  );
};
