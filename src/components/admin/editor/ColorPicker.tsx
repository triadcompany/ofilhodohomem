import { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ColorPickerProps {
  editor: Editor;
}

const COLORS = [
  { name: "Preto", value: "#000000" },
  { name: "Cinza escuro", value: "#4b5563" },
  { name: "Cinza", value: "#9ca3af" },
  { name: "Vermelho", value: "#dc2626" },
  { name: "Laranja", value: "#ea580c" },
  { name: "Amarelo", value: "#ca8a04" },
  { name: "Verde", value: "#16a34a" },
  { name: "Azul", value: "#2563eb" },
  { name: "Roxo", value: "#9333ea" },
  { name: "Rosa", value: "#db2777" },
  { name: "Marrom", value: "#78350f" },
  { name: "Branco", value: "#ffffff" },
];

export const ColorPicker = ({ editor }: ColorPickerProps) => {
  const currentColor = editor.getAttributes("textStyle").color;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 relative"
          title="Cor do texto"
        >
          <Palette className="w-4 h-4" />
          {currentColor && (
            <div
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="grid grid-cols-6 gap-1">
          {COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => editor.chain().focus().setColor(color.value).run()}
              className={`w-6 h-6 rounded border hover:scale-110 transition-transform ${
                color.value === "#ffffff" ? "border-gray-300" : "border-transparent"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Remover cor
        </Button>
      </PopoverContent>
    </Popover>
  );
};
