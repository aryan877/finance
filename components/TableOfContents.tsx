"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface TocItem {
  level: number;
  text: string;
  id: string;
}

function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/\*/g, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({ level, text, id });
    }
  });

  return toc;
}

const TocItem = ({
  item,
  onClick,
}: {
  item: TocItem;
  onClick: (id: string) => void;
}) => (
  <Button
    variant="ghost"
    className={`w-full justify-start text-left ${
      item.level > 1 ? `pl-${(item.level - 1) * 4}` : ""
    }`}
    onClick={() => onClick(item.id)}
  >
    {item.level > 1 && <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />}
    <span className={`${item.level === 1 ? "font-semibold" : ""} truncate`}>
      {item.text}
    </span>
  </Button>
);

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    setToc(extractToc(content));
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="toc-nav">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="space-y-1">
          {toc.map((item, index) => (
            <TocItem key={index} item={item} onClick={handleClick} />
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}
