"use client";

import { useState, Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import TableOfContents from "@/components/TableOfContents";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

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
  const [showToc, setShowToc] = useState(false);

  const {
    data: article,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["article", params.slug],
    queryFn: () => fetchArticle(params.slug),
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );
  if (!article) return <div className="text-center py-8">No article found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 text-center tracking-tight leading-none">
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
              <div className="markdown-content">
                <MDXRemote
                  source={article.content}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkMath],
                      rehypePlugins: [rehypeHighlight, rehypeKatex, rehypeSlug],
                    },
                  }}
                  components={{
                    h1: (props) => (
                      <h1
                        className="text-2xl sm:text-3xl md:text-4xl font-extrabold my-6 tracking-tight leading-none"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="text-xl sm:text-2xl md:text-3xl font-bold my-5 tracking-tight leading-tight"
                        {...props}
                      />
                    ),
                    h3: (props) => (
                      <h3
                        className="text-lg sm:text-xl md:text-2xl font-semibold my-4 tracking-tight leading-snug"
                        {...props}
                      />
                    ),
                    h4: (props) => (
                      <h4
                        className="text-base sm:text-lg md:text-xl font-medium my-3 tracking-tight leading-snug"
                        {...props}
                      />
                    ),
                    h5: (props) => (
                      <h5
                        className="text-sm sm:text-base md:text-lg font-medium my-2 tracking-tight leading-snug"
                        {...props}
                      />
                    ),
                    h6: (props) => (
                      <h6
                        className="text-xs sm:text-sm md:text-base font-medium my-2 tracking-tight leading-snug"
                        {...props}
                      />
                    ),
                    p: (props) => (
                      <p
                        className="text-sm sm:text-base leading-relaxed my-3 break-words"
                        {...props}
                      />
                    ),
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
