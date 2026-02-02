import { useState, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Heading1,
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Eye, 
  Edit3,
  Minus,
  Highlighter,
  Underline,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const COLORS = [
  { name: "Vermelho", value: "#dc2626" },
  { name: "Laranja", value: "#ea580c" },
  { name: "Amarelo", value: "#ca8a04" },
  { name: "Verde", value: "#16a34a" },
  { name: "Azul", value: "#2563eb" },
  { name: "Roxo", value: "#9333ea" },
  { name: "Rosa", value: "#db2777" },
  { name: "Cinza", value: "#6b7280" },
];

const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getTextarea = useCallback(() => {
    return textareaRef.current || document.getElementById("markdown-content") as HTMLTextAreaElement;
  }, []);

  const wrapSelection = useCallback((before: string, after: string = "") => {
    const textarea = getTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    requestAnimationFrame(() => {
      textarea.focus();
      if (selectedText) {
        const newPosition = start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newPosition, newPosition);
      } else {
        const newPosition = start + before.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    });
  }, [value, onChange, getTextarea]);

  const insertAtLineStart = useCallback((prefix: string) => {
    const textarea = getTextarea();
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const currentLine = value.substring(lineStart, lineEnd === -1 ? value.length : lineEnd);
    
    // Remove existing heading prefixes
    const cleanLine = currentLine.replace(/^#{1,3}\s*/, '');
    const newLine = prefix + cleanLine;
    
    const newText = value.substring(0, lineStart) + newLine + value.substring(lineEnd === -1 ? value.length : lineEnd);
    onChange(newText);
    
    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = lineStart + prefix.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  }, [value, onChange, getTextarea]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          wrapSelection("**", "**");
          break;
        case 'i':
          e.preventDefault();
          wrapSelection("_", "_");
          break;
        case 'u':
          e.preventDefault();
          wrapSelection("<u>", "</u>");
          break;
        case 'k':
          e.preventDefault();
          wrapSelection("[", "](url)");
          break;
        case '1':
          e.preventDefault();
          insertAtLineStart("# ");
          break;
        case '2':
          e.preventDefault();
          insertAtLineStart("## ");
          break;
        case '3':
          e.preventDefault();
          insertAtLineStart("### ");
          break;
      }
    }
  };

  const formatBold = () => wrapSelection("**", "**");
  const formatItalic = () => wrapSelection("_", "_");
  const formatUnderline = () => wrapSelection("<u>", "</u>");
  const formatHighlight = () => wrapSelection("<mark>", "</mark>");
  const formatLink = () => wrapSelection("[", "](url)");
  const insertHr = () => {
    const textarea = getTextarea();
    if (!textarea) return;
    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + "\n\n---\n\n" + value.substring(start);
    onChange(newText);
  };
  const insertList = () => insertAtLineStart("- ");
  const insertNumberedList = () => insertAtLineStart("1. ");
  const insertQuote = () => insertAtLineStart("> ");
  
  const applyColor = (color: string) => {
    wrapSelection(`<span style="color: ${color}">`, "</span>");
  };

  const applyAlignment = (align: string) => {
    wrapSelection(`<div style="text-align: ${align}">`, "</div>");
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/50 border-b border-border px-2 py-1 gap-2">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 flex-wrap">
            {/* Text formatting */}
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatBold} title="Negrito (Ctrl+B)">
              <Bold className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatItalic} title="Itálico (Ctrl+I)">
              <Italic className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatUnderline} title="Sublinhado (Ctrl+U)">
              <Underline className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatHighlight} title="Destacar">
              <Highlighter className="w-4 h-4" />
            </Button>
            
            {/* Color picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Cor do texto">
                  <Palette className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <div className="grid grid-cols-4 gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => applyColor(color.value)}
                      className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* Headings */}
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertAtLineStart("# ")} title="Título 1">
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertAtLineStart("## ")} title="Título 2">
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => insertAtLineStart("### ")} title="Título 3">
              <Heading3 className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* Lists and quotes */}
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertList} title="Lista">
              <List className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertNumberedList} title="Lista numerada">
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertQuote} title="Citação">
              <Quote className="w-4 h-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            {/* Alignment */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Alinhamento">
                  <AlignLeft className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => applyAlignment("left")}>
                  <AlignLeft className="w-4 h-4 mr-2" /> Esquerda
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyAlignment("center")}>
                  <AlignCenter className="w-4 h-4 mr-2" /> Centro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyAlignment("right")}>
                  <AlignRight className="w-4 h-4 mr-2" /> Direita
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Link and HR */}
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={formatLink} title="Link (Ctrl+K)">
              <Link className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={insertHr} title="Linha horizontal">
              <Minus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Tabs */}
          <TabsList className="h-8 bg-transparent">
            <TabsTrigger value="edit" className="h-7 px-3 text-xs gap-1.5">
              <Edit3 className="w-3 h-3" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 px-3 text-xs gap-1.5">
              <Eye className="w-3 h-3" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            ref={textareaRef}
            id="markdown-content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-y font-mono text-sm leading-relaxed"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[400px] p-6 prose prose-sm max-w-none 
            prose-headings:font-display prose-headings:text-foreground prose-headings:mt-6 prose-headings:mb-4
            prose-h1:text-2xl prose-h1:font-bold prose-h1:border-b prose-h1:border-border prose-h1:pb-2
            prose-h2:text-xl prose-h2:font-semibold 
            prose-h3:text-lg prose-h3:font-medium
            prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline 
            prose-strong:text-foreground prose-strong:font-semibold
            prose-em:italic
            prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:pl-6
            prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:pl-6
            prose-li:marker:text-accent prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-hr:border-border prose-hr:my-8">
            {value ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4 border-b border-border pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                  ul: ({ children }) => <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 my-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent bg-muted/30 py-2 px-4 my-4 italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  mark: ({ children }) => (
                    <mark className="bg-accent/30 px-1 rounded">{children}</mark>
                  ),
                  u: ({ children }) => <u>{children}</u>,
                  span: ({ style, children, ...props }) => <span style={style} {...props}>{children}</span>,
                  div: ({ style, children, ...props }) => <div style={style} {...props}>{children}</div>,
                }}
              >
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">
                Nenhum conteúdo para visualizar. Comece a escrever na aba "Editar".
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Markdown Help */}
      <div className="bg-muted/30 border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          <strong>Atalhos:</strong>{" "}
          <code className="bg-muted px-1 rounded mx-0.5">Ctrl+B</code> negrito,{" "}
          <code className="bg-muted px-1 rounded mx-0.5">Ctrl+I</code> itálico,{" "}
          <code className="bg-muted px-1 rounded mx-0.5">Ctrl+U</code> sublinhado,{" "}
          <code className="bg-muted px-1 rounded mx-0.5">Ctrl+K</code> link.{" "}
          Use <strong>linha em branco</strong> entre parágrafos.
        </p>
      </div>
    </div>
  );
};

export default MarkdownEditor;
