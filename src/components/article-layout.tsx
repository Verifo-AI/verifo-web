import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ArticleLayoutProps {
  title: string;
  subtitle: string;
  category: string;
  categoryLink: string;
  children: React.ReactNode;
  relatedLinks: { title: string; href: string }[];
}

export function ArticleLayout({
  title,
  subtitle,
  category,
  categoryLink,
  children,
  relatedLinks,
}: ArticleLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-8 pt-6">
          <Link href="/" className="hover:text-primary transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <Link href={categoryLink} className="hover:text-primary transition-colors shrink-0">
            {category}
          </Link>
          <ChevronRight className="w-4 h-4 shrink-0" />
          <span className="text-foreground font-medium truncate">{title}</span>
        </nav>

        {/* Mobile: "In this section" toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl text-sm font-semibold text-foreground"
          >
            <span>Also in {category}</span>
            <ChevronRight className={cn("w-4 h-4 text-muted-foreground transition-transform", sidebarOpen && "rotate-90")} />
          </button>
          {sidebarOpen && (
            <div className="mt-2 px-4 py-3 bg-card border border-border rounded-xl">
              <ul className="space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors block py-1"
                      onClick={() => setSidebarOpen(false)}
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_240px] gap-8 lg:gap-16">
          {/* Main article */}
          <article className="min-w-0">
            <header className="mb-10">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
                {category}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                {subtitle}
              </p>
            </header>
            
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed
              prose-li:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline
              prose-code:text-primary prose-code:bg-primary/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[hsl(28_40%_9%)] prose-pre:border prose-pre:border-border/20
              prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
              prose-hr:border-border
              prose-table:text-sm
              prose-th:text-foreground prose-th:font-semibold
              prose-td:text-muted-foreground
            ">
              {children}
            </div>
          </article>

          {/* Desktop sidebar — sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-xs tracking-wider uppercase text-muted-foreground mb-4">
                  Also in {category}
                </h3>
                <ul className="space-y-1 border-l-2 border-border pl-4">
                  {relatedLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm hover:text-primary transition-colors block py-1.5 text-muted-foreground hover:translate-x-0.5 duration-150"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-primary/8 border border-primary/20 rounded-xl p-5">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Ready to start?</p>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">Get 100 free credits, no card required.</p>
                <Link
                  href="/sign-up"
                  className="block text-center text-sm font-semibold bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:opacity-90 transition-opacity"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
