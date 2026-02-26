import { ReactNode } from "react";

interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children?: ReactNode;
}

const SectionTitle = ({ subtitle, title, description, align = "center", children }: SectionTitleProps) => {
  return (
    <div className={`mb-14 ${align === "center" ? "text-center" : "text-left"}`}>
      {subtitle && (
        <span className="inline-block font-ui text-xs font-semibold tracking-widest text-accent uppercase mb-3 relative">
          <span className="relative z-10">{subtitle}</span>
          <span className="absolute -bottom-1 left-0 w-full h-2 bg-accent/10 rounded" />
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide leading-tight">
        {title}
      </h2>
      {description && (
        <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed text-lg">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default SectionTitle;
