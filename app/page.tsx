"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface Article {
  slug: string;
  title: string;
}

async function fetchArticles() {
  const response = await fetch("/api/articles");
  if (!response.ok) throw new Error("Failed to fetch articles");
  return response.json();
}

export default function FinanceHub() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Finance Hub</h1>
      <p className="text-xl text-center mb-8 text-muted-foreground">
        Explore financial concepts, calculations, and insights
      </p>
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md mx-auto"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Link href={`/markdown/${article.slug}`} key={article.slug}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <CardTitle className="text-xl">
                  {article.title.replace(/\*\*/g, "")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click to explore this financial topic.
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
