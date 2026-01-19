import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link, Eye, Edit3 } from "lucide-react";
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
    
    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Negrito", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Itálico", action: () => insertMarkdown("*", "*") },
    { icon: Heading2, label: "Título", action: () => insertMarkdown("\n## ") },
    { icon: Heading3, label: "Subtítulo", action: () => insertMarkdown("\n### ") },
    { icon: List, label: "Lista", action: () => insertMarkdown("\n- ") },
    { icon: ListOrdered, label: "Lista Numerada", action: () => insertMarkdown("\n1. ") },
    { icon: Quote, label: "Citação", action: () => insertMarkdown("\n> ") },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
  ];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between bg-muted/50 border-b border-border px-2 py-1">
          {/* Toolbar */}
          <div className="flex items-center gap-1">
            {toolbarButtons.map((btn, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={btn.action}
                title={btn.label}
              >
                <btn.icon className="w-4 h-4" />
              </Button>
            ))}
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
            placeholder={placeholder}
            className="min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-y font-mono text-sm"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[400px] p-4 prose prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2 prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-accent prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
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
          <strong>Dica:</strong> Use <code className="bg-muted px-1 rounded">## Título</code>, <code className="bg-muted px-1 rounded">**negrito**</code>, <code className="bg-muted px-1 rounded">*itálico*</code>, <code className="bg-muted px-1 rounded">- item</code> para formatar
        </p>
      </div>
    </div>
  );
};

export default MarkdownEditor;
