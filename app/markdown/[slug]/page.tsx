import { Suspense } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import "katex/dist/katex.min.css";
import TableOfContents from "@/components/TableOfContents";

async function fetchArticle(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/article/${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}

export default async function FinanceTopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { content, title } = await fetchArticle(params.slug);
  const cleanTitle = title.replace(/\*\*/g, "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        {cleanTitle}
      </h1>
      <div className="lg:grid lg:grid-cols-4 lg:gap-8">
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          <div className="sticky top-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
            <TableOfContents content={content} />
          </div>
        </aside>
        <main className="lg:col-span-3">
          <article className="prose prose-lg dark:prose-invert max-w-none">
            <Suspense fallback={<div>Loading...</div>}>
              <MDXRemote
                source={content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeHighlight, rehypeKatex, rehypeSlug],
                  },
                }}
              />
            </Suspense>
          </article>
        </main>
      </div>
    </div>
  );
}
