import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { usePage } from "@/hooks/usePages";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: page, isLoading, error } = usePage(slug || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-16 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || !page) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {page.hero_title || page.title}
          </h1>
          {page.hero_subtitle && (
            <p className="font-body text-lg text-primary-foreground/70 max-w-2xl mx-auto">
              {page.hero_subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {(page.section_subtitle || page.section_title) && (
              <SectionTitle
                subtitle={page.section_subtitle || undefined}
                title={page.section_title || undefined}
                align="left"
              />
            )}

            {page.content && (
              <div className="prose prose-lg max-w-none 
                prose-headings:font-display prose-headings:text-foreground
                prose-p:font-body prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:marker:text-accent
                prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground prose-blockquote:italic
                prose-hr:border-border prose-hr:my-10">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                    components={{
                      p: ({ children }) => {
                        // Check if this paragraph contains only a YouTube link
                        const text = typeof children === 'string' ? children : 
                          Array.isArray(children) ? children.map(c => (typeof c === 'string' ? c : '')).join('') : '';
                        const ytMatch = text.trim().match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                        if (ytMatch) {
                          return (
                            <div className="my-8 rounded-2xl overflow-hidden shadow-elevated aspect-video">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                                title="YouTube video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          );
                        }
                        return <p className="mb-6 leading-relaxed">{children}</p>;
                      },
                      a: ({ href, children }) => {
                        // Also handle YouTube links rendered as <a> tags
                        const ytMatch = href?.match(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                        if (ytMatch) {
                          return (
                            <div className="my-8 rounded-2xl overflow-hidden shadow-elevated aspect-video">
                              <iframe
                                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                                title="YouTube video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              />
                            </div>
                          );
                        }
                        return <a href={href} className="text-accent hover:underline">{children}</a>;
                      },
                      h1: ({ children }) => <h1 className="text-3xl font-bold mt-10 mb-6">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-accent pl-6 py-2 my-6 bg-muted/30 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                    }}
                >
                  {page.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicPage;
