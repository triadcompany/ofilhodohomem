import { Editor } from "@tiptap/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectorProps {
  editor: Editor;
}

const FONTS = [
  { name: "Padrão", value: "" },
  { name: "Arial", value: "Arial" },
  { name: "Georgia", value: "Georgia" },
  { name: "Times New Roman", value: "Times New Roman" },
  { name: "Courier New", value: "Courier New" },
  { name: "Verdana", value: "Verdana" },
  { name: "Trebuchet MS", value: "Trebuchet MS" },
  { name: "Comic Sans MS", value: "Comic Sans MS" },
];

export const FontSelector = ({ editor }: FontSelectorProps) => {
  const currentFont = editor.getAttributes("textStyle").fontFamily || "";

  const handleFontChange = (value: string) => {
    if (value === "") {
      editor.chain().focus().unsetFontFamily().run();
    } else {
      editor.chain().focus().setFontFamily(value).run();
    }
  };

  return (
    <Select value={currentFont} onValueChange={handleFontChange}>
      <SelectTrigger className="h-8 w-[130px] text-xs">
        <SelectValue placeholder="Fonte" />
      </SelectTrigger>
      <SelectContent>
        {FONTS.map((font) => (
          <SelectItem
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value || "inherit" }}
          >
            {font.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
