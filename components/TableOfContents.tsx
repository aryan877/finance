"use client";

import { useState, useEffect } from "react";

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
      const text = match[2].replace(/\*/g, ""); // Remove asterisks
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      toc.push({ level, text, id });
    }
  });

  return toc;
}

export default function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    setToc(extractToc(content));
  }, [content]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Adjust this value to account for any fixed headers
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav className="toc-nav">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-2 text-sm">
        {toc.map((item, index) => (
          <li
            key={index}
            className={`${item.level === 1 ? "font-semibold" : ""} ${
              item.level > 1 ? `ml-${(item.level - 1) * 4}` : ""
            }`}
          >
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="hover:underline text-blue-600 dark:text-blue-400"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
