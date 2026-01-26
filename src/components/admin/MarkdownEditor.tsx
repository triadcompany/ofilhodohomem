import { useState } from "react";
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
  Type,
  Highlighter,
  Underline,
  ALargeSmall,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const [activeTab, setActiveTab] = useState<string>("edit");

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Reposition cursor after the inserted text
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        // If there was selected text, place cursor after the closing tag
        const newPosition = start + before.length + selectedText.length + after.length;
        textarea.setSelectionRange(newPosition, newPosition);
      } else {
        // If no selection, place cursor between the tags
        const newPosition = start + before.length;
        textarea.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertMarkdown("**", "**");
          break;
        case 'i':
          e.preventDefault();
          insertMarkdown("*", "*");
          break;
        case 'u':
          e.preventDefault();
          insertMarkdown("<u>", "</u>");
          break;
        case 'k':
          e.preventDefault();
          insertMarkdown("[", "](url)");
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

  const toolbarButtons = [
    { icon: Bold, label: "Negrito (Ctrl+B)", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Itálico (Ctrl+I)", action: () => insertMarkdown("*", "*") },
    { icon: Underline, label: "Sublinhado", action: () => insertMarkdown("<u>", "</u>") },
    { icon: Highlighter, label: "Destacar", action: () => insertMarkdown("==", "==") },
    { type: "separator" as const },
    { icon: Heading1, label: "Título Principal", action: () => insertAtLineStart("# ") },
    { icon: Heading2, label: "Título", action: () => insertAtLineStart("## ") },
    { icon: Heading3, label: "Subtítulo", action: () => insertAtLineStart("### ") },
    { type: "separator" as const },
    { icon: List, label: "Lista", action: () => insertAtLineStart("- ") },
    { icon: ListOrdered, label: "Lista Numerada", action: () => insertAtLineStart("1. ") },
    { icon: Quote, label: "Citação Bíblica", action: () => insertAtLineStart("> ") },
    { type: "separator" as const },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: Minus, label: "Linha Horizontal", action: () => insertMarkdown("\n\n---\n\n") },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/50 border-b border-border px-2 py-1 gap-2">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 flex-wrap">
            {toolbarButtons.map((btn, index) => (
              'type' in btn && btn.type === 'separator' ? (
                <div key={index} className="w-px h-6 bg-border mx-1" />
              ) : (
                <Button
                  key={index}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={'action' in btn ? btn.action : undefined}
                  title={'label' in btn ? btn.label : undefined}
                >
                  {'icon' in btn && <btn.icon className="w-4 h-4" />}
                </Button>
              )
            ))}
            
            {/* Font Family Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1"
                  title="Tipo de fonte"
                >
                  <ALargeSmall className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Fonte</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Cinzel\', serif">', '</span>')}>
                  <span style={{ fontFamily: "'Cinzel', serif" }}>Cinzel (Títulos)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Lora\', serif">', '</span>')}>
                  <span style={{ fontFamily: "'Lora', serif" }}>Lora (Corpo)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Inter\', sans-serif">', '</span>')}>
                  <span style={{ fontFamily: "'Inter', sans-serif" }}>Inter (UI)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Georgia\', serif">', '</span>')}>
                  <span style={{ fontFamily: "'Georgia', serif" }}>Georgia</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Times New Roman\', serif">', '</span>')}>
                  <span style={{ fontFamily: "'Times New Roman', serif" }}>Times New Roman</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-family: \'Arial\', sans-serif">', '</span>')}>
                  <span style={{ fontFamily: "'Arial', sans-serif" }}>Arial</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Font Size Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1"
                  title="Tamanho do texto"
                >
                  <Type className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Tamanho</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 0.75rem">', '</span>')}>
                  <span style={{ fontSize: '0.75rem' }}>Muito Pequeno (12px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 0.875rem">', '</span>')}>
                  <span style={{ fontSize: '0.875rem' }}>Pequeno (14px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 1rem">', '</span>')}>
                  <span style={{ fontSize: '1rem' }}>Normal (16px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 1.125rem">', '</span>')}>
                  <span style={{ fontSize: '1.125rem' }}>Médio (18px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 1.25rem">', '</span>')}>
                  <span style={{ fontSize: '1.25rem' }}>Grande (20px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 1.5rem">', '</span>')}>
                  <span style={{ fontSize: '1.5rem' }}>Muito Grande (24px)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => insertMarkdown('<span style="font-size: 2rem">', '</span>')}>
                  <span style={{ fontSize: '1.75rem' }}>Extra Grande (32px)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                components={{
                  // Custom paragraph with proper spacing
                  p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                  // Support for HTML spans with inline styles
                  span: ({ style, children }) => <span style={style}>{children}</span>,
                  // Support for underline
                  u: ({ children }) => <u>{children}</u>,
                  // Highlighted text (using mark)
                  mark: ({ children }) => <mark className="bg-accent/30 px-1 rounded">{children}</mark>,
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
          <strong>Atalhos:</strong> 
          <code className="bg-muted px-1 rounded mx-1">Ctrl+B</code> negrito, 
          <code className="bg-muted px-1 rounded mx-1">Ctrl+I</code> itálico, 
          <code className="bg-muted px-1 rounded mx-1">Ctrl+U</code> sublinhado, 
          <code className="bg-muted px-1 rounded mx-1">Ctrl+K</code> link, 
          <code className="bg-muted px-1 rounded mx-1">Ctrl+1/2/3</code> títulos.
          Deixe uma <strong>linha em branco</strong> entre parágrafos.
        </p>
      </div>
    </div>
  );
};

export default MarkdownEditor;
