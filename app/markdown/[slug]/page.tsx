"use client";

import { useState, useEffect, Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import TableOfContents from "@/components/TableOfContents";
import { Button } from "@/components/ui/button";

async function fetchArticle(slug: string) {
  const res = await fetch(`/api/article?slug=${slug}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

export default function FinanceTopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const [article, setArticle] = useState<{
    content: string;
    title: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await fetchArticle(params.slug);
        setArticle(data);
      } catch {
        setError("Failed to fetch article");
      } finally {
        setIsLoading(false);
      }
    }
    loadArticle();
  }, [params.slug]);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!article) return <div className="text-center py-8">No article found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center">
        {article.title}
      </h1>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="lg:sticky lg:top-8 lg:overflow-y-auto lg:max-h-[calc(100vh-4rem)]">
            <Button
              className="lg:hidden w-full mb-4"
              onClick={() => setShowToc(!showToc)}
            >
              {showToc ? "Hide" : "Show"} Table of Contents
            </Button>
            <div
              className={`${
                showToc ? "block" : "hidden"
              } lg:block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md`}
            >
              <TableOfContents content={article.content} />
            </div>
          </div>
        </aside>
        <main className="lg:col-span-3 lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8">
          <article className="prose prose-sm sm:prose sm:max-w-none md:prose-lg lg:prose-xl dark:prose-invert">
            <Suspense
              fallback={
                <div className="text-center py-4">Loading content...</div>
              }
            >
              <div className="overflow-x-auto">
                <MDXRemote
                  source={article.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkMath],
                      rehypePlugins: [rehypeHighlight, rehypeKatex, rehypeSlug],
                    },
                  }}
                />
              </div>
            </Suspense>
          </article>
        </main>
      </div>
    </div>
  );
}
